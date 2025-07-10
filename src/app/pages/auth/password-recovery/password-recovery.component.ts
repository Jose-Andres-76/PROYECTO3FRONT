import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordRecoveryService } from '../../../services/passwordrecovery.service';
import { AlertService } from '../../../services/alert.service';
import { ModalService } from '../../../services/modal.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { PasswordRecoveryFormComponent } from '../../../components/password-recovery-form/password-recovery-form.component';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, PasswordRecoveryFormComponent],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent implements OnInit {
  @ViewChild('passwordResetModal') passwordResetModal!: TemplateRef<any>;

  public fb: FormBuilder = inject(FormBuilder);
  public recoveryForm!: FormGroup;

  public passwordResetForm: { 
    code: string; 
    newPassword: string; 
    confirmPassword: string 
  } = {
    code: '',
    newPassword: '',
    confirmPassword: ''
  };

  public isLoading = false;
  public isResetting = false;
  public recoveryError = '';
  public resetError = '';
  public successMessage = '';

  private passwordRecoveryService = inject(PasswordRecoveryService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  ngOnInit() {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public handlePasswordRecovery(emailData: { email: string }) {
    this.isLoading = true;
    this.recoveryError = '';
    this.successMessage = '';

    this.passwordRecoveryService.sendRecoveryCode(emailData.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Código enviado exitosamente. Revisa tu email.';
        this.alertService.displayAlert('success', 'Código enviado a tu correo electrónico');
        
        setTimeout(() => {
          this.modalService.displayModal('md', this.passwordResetModal);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        
        let errorMessage = 'Error al enviar el código. Intenta nuevamente.';
        
        if (error.status === 200 && error.message?.includes('parsing')) {
          this.isLoading = false;
          this.successMessage = 'Código enviado exitosamente. Revisa tu email.';
          this.alertService.displayAlert('success', 'Código enviado a tu correo electrónico');
          
          setTimeout(() => {
            this.modalService.displayModal('md', this.passwordResetModal);
          }, 1500);
          return;
        }
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.recoveryError = errorMessage;
        this.alertService.displayAlert('error', errorMessage);
      }
    });
  }

  public handlePasswordReset(event: Event) {
    event.preventDefault();

    if (!this.isValidResetForm()) {
      return;
    }

    this.isResetting = true;
    this.resetError = '';

    this.passwordRecoveryService.resetPassword(
      this.recoveryForm.controls['email'].value,
      this.passwordResetForm.code,
      this.passwordResetForm.newPassword
    ).subscribe({
      next: (response) => {
        this.isResetting = false;
        this.alertService.displayAlert('success', 'Contraseña restablecida exitosamente');
        this.modalService.closeAll();
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1000);
      },
      error: (error) => {
        this.isResetting = false;
        
        if (error.status === 200 && error.message?.includes('parsing')) {
          this.isResetting = false;
          this.alertService.displayAlert('success', 'Contraseña restablecida exitosamente');
          this.modalService.closeAll();
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1000);
          return;
        }
        
        let errorMessage = 'Error al restablecer la contraseña. Verifica el código.';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.resetError = errorMessage;
        this.alertService.displayAlert('error', errorMessage);
      }
    });
  }

  public isValidResetForm(): boolean {
    return this.passwordResetForm.code.length === 6 &&
           this.passwordResetForm.newPassword.length >= 6 &&
           this.passwordResetForm.newPassword === this.passwordResetForm.confirmPassword;
  }

  public closeModal() {
    this.modalService.closeAll();
    this.resetPasswordResetForm();
  }

  private resetPasswordResetForm() {
    this.passwordResetForm = {
      code: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.resetError = '';
  }
}
