import { DatetimePipe } from './datetime.pipe';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FederatedLoginComponent } from '../../auth/federated-login/federated-login.component';
import { LANGUAGE } from '../../../../environments/languages';
import { Language } from '../../../_models/models';

describe('DatetimePipe', () => {

    let pipe: DatetimePipe;

    beforeEach(() => {
        const lang: Language = {
            nativeName: 'English',
            code: 'en',
            dateFormat: 'M/d/yyyy',
            datetimeFormat: 'M/d/yyyy, h:mm a',
            weight: 1,
        };

        TestBed.configureTestingModule({
            imports: [RouterModule.forRoot([]), FederatedLoginComponent],
            providers: [
                {provide: LANGUAGE, useValue: lang},
            ],
        });
        pipe = TestBed.runInInjectionContext(() => new DatetimePipe());
    });

    it('is created', () => {
        expect(pipe).toBeTruthy();
    });

    [
        {in: undefined,                        format: undefined,  out: ''},
        {in: null,                             format: undefined,  out: ''},
        {in: '',                               format: undefined,  out: ''},
        {in: '0001-01-01T00:00:00.000Z',       format: undefined,  out: ''},
        {in: undefined,                        format: 'date',     out: ''},
        {in: null,                             format: 'date',     out: ''},
        {in: '',                               format: 'date',     out: ''},
        {in: '0001-01-01T00:00:00.000Z',       format: 'date',     out: ''},
        {in: undefined,                        format: 'dateTime', out: ''},
        {in: null,                             format: 'dateTime', out: ''},
        {in: '',                               format: 'dateTime', out: ''},
        {in: '0001-01-01T00:00:00.000Z',       format: 'dateTime', out: ''},
        {in: new Date(2021, 0, 2, 3, 4, 5, 6), format: 'dateTime', out: '1/2/2021, 3:04 AM'},
        {in: new Date(2021, 0, 2, 3, 4, 5, 6), format: undefined,  out: '1/2/2021, 3:04 AM'},
        {in: new Date(2021, 0, 2, 3, 4, 5, 6), format: 'WHATEVER', out: '1/2/2021, 3:04 AM'},
        {in: new Date(2021, 0, 2, 3, 4, 5, 6), format: 'date',     out: '1/2/2021'},
    ]
        .forEach(test => it(`formats '${test.in}' with format '${test.format}' as '${test.out}'`, () => {
            expect(pipe.transform(test.in, test.format)).toEqual(test.out);
        }));
});
