import { Pipe, PipeTransform, inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { Language } from '../../../_models/models';
import { LANGUAGE } from '../../../../environments/languages';

@Pipe({
    name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

    private readonly lang = inject<Language>(LANGUAGE);

    /** Date string as returned from the Go backend when no date is provided. */
    static readonly ZERO_DATE = '0001-01-01T00:00:00.000Z';

    /**
     * Transforms a date (Date or string) into a formatted date string, taking a possible "zero date" into account.
     * @param value Input date.
     * @param format Optional format, either 'datetime' (the default) or 'date'.
     */
    transform(value: string | Date | null | undefined, format?: string): string {
        // Handle zero or null dates
        if (!value || value === DatetimePipe.ZERO_DATE) {
            return '';
        }

        // Format the date using the current language
        return formatDate(
            value,
            format === 'date' ? this.lang.dateFormat : this.lang.datetimeFormat,
            this.lang.code);
    }
}
