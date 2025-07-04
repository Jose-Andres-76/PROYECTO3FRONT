import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LogoTituloComponent } from '../logo-titulo/logo-titulo.component';

@Component({
  selector: 'app-password-recovery-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LogoTituloComponent],
  templateUrl: './password-recovery-form.component.html',
  styleUrl: './password-recovery-form.component.scss'
})
export class PasswordRecoveryFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  
  @Input() form!: FormGroup;
  @Input() isLoading = false;
  @Input() recoveryError = '';
  @Input() successMessage = '';
  
  @Output() callSubmitMethod: EventEmitter<{ email: string }> = new EventEmitter<{ email: string }>();

  public handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailData = {
      email: this.form.controls['email'].value
    };
    
    this.callSubmitMethod.emit(emailData);
  }
}
