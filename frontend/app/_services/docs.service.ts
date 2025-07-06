import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { ConfigService } from './config.service';
import { Utils } from '../_utils/utils';

@Injectable({
    providedIn: 'root',
})
export class DocsService {

    private readonly locale      = inject(LOCALE_ID);
    private readonly baseDocsUrl = inject(ConfigService).staticConfig.baseDocsUrl;

    get urlHome(): string {
        return this.getPageUrl('');
    }

    get urlAbout(): string {
        return this.getPageUrl('about/');
    }

    /**
     * Return the URL of an embeddable with the given name
     * @param pageName Name of the embeddable page.
     */
    getEmbedPageUrl(pageName: string): string {
        return this.getPageUrl(`embed/${pageName}/`);
    }

    /**
     * Return a complete absolute URL for the given page and language.
     * @param path Page path within the language site.
     * @param lang Language to return a URL for. Optional, defaults to the current UI language.
     */
    getPageUrl(path: string, lang?: string): string {
        return Utils.joinUrl(this.baseDocsUrl, lang || this.locale, path);
    }
}
