import { inject, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EditProfileServiceService extends BaseService<IUser> {
  protected override source: string = 'users';
  private alertService: AlertService = inject(AlertService);
  public authService = inject(AuthService);

  constructor() {
    super();
  }

  updateProfilePicture(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    password: string;
    currentPassword: string;
    image: File;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('lastname', profileData.lastname);
    formData.append('age', profileData.age.toString());
    formData.append('points', profileData.points.toString());
    formData.append('password', profileData.password.toString());
    formData.append('passwordConfirmation', profileData.currentPassword.toString());
    formData.append('image', profileData.image);

    const url = `${this.source}/editProfilePicture/${userId}`;
    
    return this.http.patch(url, formData);
  }

 
   updateProfileNoPic(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    password: string;
    currentPassword: string;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('lastname', profileData.lastname);
    formData.append('age', profileData.age.toString());
    formData.append('points', profileData.points.toString());
    formData.append('password', profileData.password.toString());
    formData.append('passwordConfirmation', profileData.currentPassword.toString());

    const url = `${this.source}/editProfile/${userId}`;
    
    return this.http.patch(url, formData);
  }

  saveProfilePicture(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    password: string;
    image: File;
    currentPassword: string;
  }) {
  
    this.updateProfilePicture(userId, profileData).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Perfil actualizado exitosamente', 'center', 'top', ['success-snackbar']);
  

        setTimeout(() => {
          window.location.reload();
        }, 1500); 
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el perfil', 'center', 'top', ['error-snackbar']);
        console.error('Error updating profile picture:', err);
      }
    });
  }

  saveProfileNormal(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    password: string;
    currentPassword: string;
  }) {
  
    this.updateProfileNoPic(userId, profileData).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Perfil actualizado exitosamente', 'center', 'top', ['success-snackbar']);

        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el perfil', 'center', 'top', ['error-snackbar']);
        console.error('Error updating profile picture:', err);
      }
    });
  }



}
