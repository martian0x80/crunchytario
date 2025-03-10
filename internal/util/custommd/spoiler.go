package custommd

import (
	"fmt"
	"github.com/yuin/goldmark"
	gast "github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer"
	"github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/text"
	"github.com/yuin/goldmark/util"
)

// A SpoilerNode struct represents a spoiler section of GFM text.
type SpoilerNode struct {
	gast.BaseInline
}

// NewSpoilerNode returns a new Strikethrough node.
func NewSpoilerNode() *SpoilerNode {
	return &SpoilerNode{}
}

// Dump implements Node.Dump.
func (n *SpoilerNode) Dump(source []byte, level int) {
	gast.DumpHelper(n, source, level, nil, nil)
}

var KindSpoiler = gast.NewNodeKind("Spoiler")

// Kind implements Node.Kind.
func (n *SpoilerNode) Kind() gast.NodeKind {
	return KindSpoiler
}

func (n *SpoilerNode) Attributes() []gast.Attribute {
	return []gast.Attribute{
		{Name: []byte("class"), Value: []byte("crunchy-comments-spoiler")},
	}
}

// ========================

// spoilerDelimiterProcessor is a delimiter processor for spoilers.
type spoilerDelimiterProcessor struct {
}

// IsDelimiter implements parser.DelimiterProcessor.IsDelimiter.
func (p *spoilerDelimiterProcessor) IsDelimiter(b byte) bool {
	return b == '|'
}

// CanOpenCloser implements parser.DelimiterProcessor.CanOpenCloser.
func (p *spoilerDelimiterProcessor) CanOpenCloser(opener, closer *parser.Delimiter) bool {
	return opener.Char == closer.Char
}

// OnMatch implements parser.DelimiterProcessor.OnMatch.
func (p *spoilerDelimiterProcessor) OnMatch(int) gast.Node {
	return NewSpoilerNode()
}

var defaultSpoilerDelimiterProcessor = &spoilerDelimiterProcessor{}

// ========================

// spoilerParser is a parser for pipe spoilerDelimiters.
type spoilerParser struct {
	ActiveSpoilerKey parser.ContextKey
}

// Trigger implements InlineParser.Trigger.
func (s *spoilerParser) Trigger() []byte {
	return []byte{'|'}
}

var delimiterLength = 2

func truncate(node *parser.Delimiter, newLength int) *parser.Delimiter {
	node.Segment = node.Segment.WithStop(node.Segment.Start + newLength)
	node.Length = newLength
	node.OriginalLength = newLength
	return node
}

func oNode(node *parser.Delimiter, segment text.Segment) *parser.Delimiter {
	node.Segment = segment
	node = truncate(node, delimiterLength)
	node.CanOpen = true
	node.CanClose = false
	return node
}

func cNode(node *parser.Delimiter, segment text.Segment) *parser.Delimiter {
	node.Segment = segment
	node = truncate(node, delimiterLength)
	node.CanOpen = false
	node.CanClose = true
	return node
}

// SpoilerStatus is a status of spoiler parsing. (lets build a little state machine :D)
type SpoilerStatus int

const (
	NoSpoiler SpoilerStatus = iota
	EmptySpoiler
	NonEmptySpoiler
)

// Parse implements InlineParser.Parse.
func (s *spoilerParser) Parse(_ gast.Node, block text.Reader, pc parser.Context) gast.Node {
	pc.ComputeIfAbsent(s.ActiveSpoilerKey, func() interface{} { return NoSpoiler })
	spoilerStatus := pc.Get(s.ActiveSpoilerKey)
	if spoilerStatus == EmptySpoiler {
		pc.Set(s.ActiveSpoilerKey, NonEmptySpoiler)
		return nil
	}

	before := block.PrecendingCharacter()
	line, segment := block.PeekLine()
	node := parser.ScanDelimiter(line, before, delimiterLength, defaultSpoilerDelimiterProcessor)
	if node == nil {
		return nil
	}

	switch spoilerStatus {
	case NoSpoiler:
		if node.Length == delimiterLength {
			// emptySpoiler is only needed for more than two pipes in a row -> some of them are not delimiters then
			spoilerStatus = NonEmptySpoiler
		} else {
			spoilerStatus = EmptySpoiler
		}
		node = oNode(node, segment)
	case NonEmptySpoiler:
		spoilerStatus = NoSpoiler
		node = cNode(node, segment)
	// case EmptySpoiler is already handled above
	default:
		fmt.Printf("[Spoiler MD Extension] Unknown spoiler status: %v", spoilerStatus)
		return nil
	}

	pc.Set(s.ActiveSpoilerKey, spoilerStatus)
	block.Advance(delimiterLength)
	pc.PushDelimiter(node)
	return node
}

var defaultSpoilerParser = &spoilerParser{ActiveSpoilerKey: parser.NewContextKey()}

// NewSpoilerParser return a new InlineParser that parses spoiler expressions.
func NewSpoilerParser() parser.InlineParser {
	return defaultSpoilerParser
}

// ========================

// SpoilerHTMLRenderer is a renderer.NodeRenderer implementation that renders Spoiler nodes.
type SpoilerHTMLRenderer struct {
	html.Config
}

// NewSpoilerHTMLRenderer returns a new SpoilerHTMLRenderer.
func NewSpoilerHTMLRenderer(opts ...html.Option) renderer.NodeRenderer {
	r := &SpoilerHTMLRenderer{
		Config: html.NewConfig(),
	}
	for _, opt := range opts {
		opt.SetHTMLOption(&r.Config)
	}
	return r
}

// RegisterFuncs implements renderer.NodeRenderer.RegisterFuncs.
func (r *SpoilerHTMLRenderer) RegisterFuncs(reg renderer.NodeRendererFuncRegisterer) {
	reg.Register(KindSpoiler, r.renderSpoiler)
}

// SpoilerAttributeFilter defines attribute names which spoiler elements can have (global = work for all).
var SpoilerAttributeFilter = html.GlobalAttributeFilter

func (r *SpoilerHTMLRenderer) renderSpoiler(w util.BufWriter, _ []byte, n gast.Node, entering bool) (gast.WalkStatus, error) {
	// source has the full original text
	// n is the whole spoiler node (entering until exiting)

	if entering {
		if n.Attributes() != nil {
			_, _ = w.WriteString("<span")
			html.RenderAttributes(w, n, SpoilerAttributeFilter)
			_ = w.WriteByte('>')
		} else {
			_, _ = w.WriteString("<span>")
		}
	} else {
		_, _ = w.WriteString("</span>")
	}
	return gast.WalkContinue, nil
}

// ========================

type spoiler struct{}

func (e *spoiler) Extend(m goldmark.Markdown) {
	m.Parser().AddOptions(parser.WithInlineParsers(
		util.Prioritized(NewSpoilerParser(), 500),
	))
	m.Renderer().AddOptions(renderer.WithNodeRenderers(
		util.Prioritized(NewSpoilerHTMLRenderer(), 500),
	))
}

// Spoiler is an extension that allows you to mark spoilers like '||text||'.
var Spoiler = &spoiler{}
