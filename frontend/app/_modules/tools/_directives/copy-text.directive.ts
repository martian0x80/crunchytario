import { Directive, ElementRef, input, Renderer2, inject } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Directive({
    selector: '[appCopyText]',
    host: {
        '(click)': 'doCopy()',
    }
})
export class CopyTextDirective {

    private readonly renderer = inject(Renderer2);
    private readonly element  = inject(ElementRef);
    private readonly tooltip  = inject(NgbTooltip, {optional: true});

    /**
     * Text that will be copied on a click on the host element. If empty, the text content of the host element will be
     * copied.
     */
    readonly appCopyText = input<string>();

    readonly tipBeforeCopy = $localize`Click to copy`;
    readonly tipAfterCopy  = $localize`Copied!`;

    constructor() {
        // If there's an ngbTooltip directive provided on the same element, use it for the hint
        if (this.tooltip) {
            this.tooltip.ngbTooltip = this.tipBeforeCopy;
            this.tooltip.autoClose = false;
            this.tooltip.animation = false;
            this.tooltip.container = 'body';

        // Put the hint into the title attribute otherwise
        } else if (this.element.nativeElement instanceof HTMLElement) {
            this.renderer.setAttribute(this.element.nativeElement, 'title', this.tipBeforeCopy);

        // No valid HTML element
        } else {
            throw new Error('No valid HTML element for appCopyText');
        }
    }

    doCopy() {
        navigator.clipboard.writeText(this.appCopyText() || this.element.nativeElement.textContent)
            .then(() => {
                if (this.tooltip) {
                    // Close the tooltip because it won't change the text on the fly, and reopen with new text
                    this.tooltip.close();
                    this.tooltip.ngbTooltip = this.tipAfterCopy;
                    this.tooltip.open();

                    // Reset the text
                    this.tooltip.ngbTooltip = this.tipBeforeCopy;
                }
            });
    }
}
