import { Component } from '@angular/core';
import { inject, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralInfoService } from '../../../../services/general-info.service';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../../services/alert.service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  email: string = '';
  isSubmitting: boolean = false;
  private alertService: AlertService = inject(AlertService);

  constructor(private generalInfoService: GeneralInfoService) {}

  onSubmit() {
    if (this.email && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Sending email to:', this.email);
      
      this.generalInfoService.sendEmailGeneralInfo(this.email).subscribe({
        next: (response) => {
          console.log('Email sent successfully:', response);
           this.alertService.displayAlert('success', 'Correo enviado exitosamente', 'center', 'top', ['success-snackbar']);
          this.email = ''; // Clean the form for next submission
          this.isSubmitting = false;
        },
        error: (error) => {
          this.alertService.displayAlert('error', 'No se ha enviar el correo electrónico', 'center', 'top', ['error-snackbar']);
          let errorMessage = 'Error al enviar el correo';
          //Set of messages for different error statuses
          if (error.status === 404) {
            errorMessage = 'Servicio no encontrado. Verifica que el backend esté ejecutándose.';
          } else if (error.status === 400) {
            errorMessage = 'Email inválido. Verifica el formato del correo.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica que el backend esté accesible.';
          } else if (error.error && typeof error.error === 'string') {
            errorMessage += ': ' + error.error;
          } else if (error.message) {
            errorMessage += ': ' + error.message;
          }
          
          alert(errorMessage);
          this.isSubmitting = false;
        },
        complete: () => {
          this.alertService.displayAlert('success', 'Correo enviado exitosamente', 'center', 'top', ['success-snackbar']);
          this.isSubmitting = false;
        }
      });
    }
  }
}


