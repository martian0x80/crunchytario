import { Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProcessingStatus } from '../../../_utils/processing-status';
import { ApiGeneralService, Configuration } from '../../../../generated-api';
import { Paths } from '../../../_utils/consts';
import { ToastService } from '../../../_services/toast.service';
import { PasswordInputComponent } from '../../tools/password-input/password-input.component';
import { SpinnerDirective } from '../../tools/_directives/spinner.directive';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    imports: [
        ReactiveFormsModule,
        PasswordInputComponent,
        SpinnerDirective,
    ],
})
export class ResetPasswordComponent implements OnDestroy {

    private readonly router    = inject(Router);
    private readonly toastSvc  = inject(ToastService);
    private readonly api       = inject(ApiGeneralService);
    private readonly apiConfig = inject(Configuration);

    readonly submitting = new ProcessingStatus();

    readonly form = inject(FormBuilder).nonNullable.group({
        newPassword: '',
    });

    constructor() {
        // Set the auth token in the API config to be used for the password change
        this.apiConfig.credentials.token = this.router.getCurrentNavigation()?.extras?.state?.token;
    }

    ngOnDestroy(): void {
        // Remove any reset token on exit
        delete this.apiConfig.credentials.token;
    }

    submit() {
        // Mark all controls touched to display validation results
        this.form.markAllAsTouched();

        // Submit the form if it's valid
        if (this.form.valid) {
            this.api.authPwdResetChange({password: this.form.value.newPassword!})
                .pipe(this.submitting.processing())
                .subscribe(() => {
                    // Add a success toast
                    this.toastSvc.success({messageId: 'password-changed', keepOnRouteChange: true});
                    // Go back to the login page
                    return this.router.navigate([Paths.auth.login]);
                });
        }
    }
}
