import {Wrap} from './element-wrap';
import {TranslateFunc} from './models';

/**
 * Interaction that can be applied to a comment body. It can be used to add interactivity to the comment content.
 */
export interface CommentInteraction {
    // Note: Might be worth to upgrade the cBody to the whole card at some point.
    apply<E extends HTMLElement>(cBody: Wrap<E>, t: TranslateFunc): void;
}

/**
 * Interaction that reveals/hides spoilers (span.comentario-spoiler) when clicked.
 */
export class SpoilerInteraction implements CommentInteraction {
    apply<E extends HTMLElement>(cBody: Wrap<E>, t: TranslateFunc): void {
        cBody.selectByTypeAndClasses('span', 'spoiler').forEach(spoiler => {
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

