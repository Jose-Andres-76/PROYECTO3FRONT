import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralInfoService } from '../../../../services/general-info.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private generalInfoService: GeneralInfoService) {}

  onSubmit() {
    if (this.email && !this.isSubmitting) {
      this.isSubmitting = true;
      console.log('Sending email to:', this.email);
      
      this.generalInfoService.sendEmailGeneralInfo(this.email).subscribe({
        next: (response) => {
          console.log('Email sent successfully:', response);
          alert('Correo enviado correctamente');
          this.email = ''; // Clean the form for next submission
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error sending email:', error);
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
          console.log('Email request completed');
          this.isSubmitting = false;
        }
      });
    }
  }
}
