import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessingStatus } from '../../../_utils/processing-status';
import { ToastService } from '../../../_services/toast.service';
import { ApiGeneralService } from '../../../../generated-api';
import { SpinnerDirective } from '../../tools/_directives/spinner.directive';
import { ValidatableDirective } from '../../tools/_directives/validatable.directive';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    imports: [
        ReactiveFormsModule,
        SpinnerDirective,
        ValidatableDirective,
    ],
})
export class ForgotPasswordComponent {

    private readonly router   = inject(Router);
    private readonly toastSvc = inject(ToastService);
    private readonly api      = inject(ApiGeneralService);

    readonly submitting = new ProcessingStatus();

    readonly form = inject(FormBuilder).nonNullable.group({
        email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(254)]],
    });

    submit(): void {
        // Mark all controls touched to display validation results
        this.form.markAllAsTouched();

        // Submit the form if it's valid
        if (this.form.valid) {
            this.api.authPwdResetSendEmail({email: this.form.controls.email.value})
                .pipe(this.submitting.processing())
                .subscribe(() => {
                    // Add a success toast
                    this.toastSvc.success({messageId: 'pwd-reset-email-sent', keepOnRouteChange: true});
                    // Go home
                    return this.router.navigate(['/']);
                });
        }
    }
}
