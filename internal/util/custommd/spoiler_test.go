package custommd

import (
	"bytes"
	"github.com/yuin/goldmark"
	"testing"
)

func Test_spoiler_Extension(t *testing.T) {
	tests := []struct {
		name string
		md   string
		html string
	}{
		{"single normal", "||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span></p>\n"},
		{"space normal", "|| ||", "<p><span class=\"crunchy-comments-spoiler\"> </span></p>\n"},
		{"trice normal", "||spoiler|| ||spoiler|| ||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span> <span class=\"crunchy-comments-spoiler\">spoiler</span> <span class=\"crunchy-comments-spoiler\">spoiler</span></p>\n"},
		{"trice no space", "||spoiler||||spoiler||||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span><span class=\"crunchy-comments-spoiler\">spoiler</span><span class=\"crunchy-comments-spoiler\">spoiler</span></p>\n"},
		{"3-pipe start", "|||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">|spoiler</span></p>\n"},
		{"4-pipe start", "||||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">||spoiler</span></p>\n"},
		{"5-pipe start", "|||||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">|</span>spoiler||</p>\n"},
		{"6-pipe start", "||||||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">|</span>|spoiler||</p>\n"},
		{"7-pipe start", "|||||||spoiler||", "<p><span class=\"crunchy-comments-spoiler\">|</span><span class=\"crunchy-comments-spoiler\">spoiler</span></p>\n"},
		{"3-pipe end", "||spoiler|||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span>|</p>\n"},
		{"4-pipe end", "||spoiler||||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span>||</p>\n"},
		{"5-pipe end", "||spoiler|||||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span>|||</p>\n"},
		{"6-pipe end", "||spoiler||||||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span>||||</p>\n"},
		{"7-pipe end", "||spoiler|||||||", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span><span class=\"crunchy-comments-spoiler\">|</span></p>\n"},
		{"3-pipe start end", "|||spoiler|||", "<p><span class=\"crunchy-comments-spoiler\">|spoiler</span>|</p>\n"},
		{"4-pipe start end", "||||spoiler||||", "<p><span class=\"crunchy-comments-spoiler\">||spoiler</span>||</p>\n"},
		{"5-pipe start end", "|||||spoiler|||||", "<p><span class=\"crunchy-comments-spoiler\">|</span>spoiler<span class=\"crunchy-comments-spoiler\">|</span></p>\n"},
		{"6-pipe start end", "||||||spoiler||||||", "<p><span class=\"crunchy-comments-spoiler\">|</span>|spoiler<span class=\"crunchy-comments-spoiler\">|</span>|</p>\n"},
		{"7-pipe start end", "|||||||spoiler|||||||", "<p><span class=\"crunchy-comments-spoiler\">|</span><span class=\"crunchy-comments-spoiler\">spoiler</span><span class=\"crunchy-comments-spoiler\">|</span></p>\n"},
		{"pipe in center", "||spo|iler||", "<p><span class=\"crunchy-comments-spoiler\">spo|iler</span></p>\n"},
		{"bold inside", "||sp**oil**er||", "<p><span class=\"crunchy-comments-spoiler\">sp<strong>oil</strong>er</span></p>\n"},
		{"bold outside", "||spoiler|| **test**", "<p><span class=\"crunchy-comments-spoiler\">spoiler</span> <strong>test</strong></p>\n"},
		{"bold earlier intersecting", "**wa||sp**oiler||", "<p><strong>wa||sp</strong>oiler||</p>\n"},
		{"bold later intersecting", "||spoil**er||na**", "<p><span class=\"crunchy-comments-spoiler\">spoil**er</span>na**</p>\n"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			md := goldmark.New(
				goldmark.WithExtensions(
					Spoiler,
				),
			)
			var html bytes.Buffer
			if err := md.Convert([]byte(tt.md), &html); err != nil {
				t.Errorf("unexpected error: %v", err)
			}
			if got := html.String(); got != tt.html {
				t.Errorf("spoilerExtension got %q, want %q", got, tt.html)
			}
		})
	}
}
