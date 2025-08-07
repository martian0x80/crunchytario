import { Wrap } from './element-wrap';
import { TranslateFunc } from './models';

/**
 * Interaction that can be applied to a comment body. It can be used to add interactivity to the comment content.
 */
export interface CommentInteraction {
    apply<E extends HTMLElement>(cParent: Wrap<E>, t: TranslateFunc): void;
}

/**
 * Interaction that reveals/hides spoilers (span.comentario-spoiler) when clicked.
 */
export class SpoilerInteraction implements CommentInteraction {
    apply<E extends HTMLElement>(cParent: Wrap<E>, t: TranslateFunc): void {
        cParent.selectByTypeAndClasses('span', 'spoiler').forEach(spoiler => {
            // Note: Suboptimal solution: this splits html setup between the MD-Parser backend and the interactions
            //       At some point this should be realized using some kind of template system
            //       This would allow the MD-Parser to generate language independent html
            //       without the need for random setup locations like this
            // Init the spoiler element
            spoiler.attr({title: t('interactionRevealSpoiler')});

            // Register the click event
            spoiler.click(spoiler => {
                const wasRevealed = spoiler.hasClass('revealed');
                spoiler
                    .setClasses(!wasRevealed, 'revealed')
                    .attr({title: t(wasRevealed ? 'interactionRevealSpoiler' : 'interactionHideSpoiler')});
            });
        });
    }
}

