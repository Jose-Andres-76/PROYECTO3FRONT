import { inject, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class EditProfileServiceService extends BaseService<IUser> {
  protected override source: string = 'users';
  private alertService: AlertService = inject(AlertService);

  constructor() {
    super();
  }

  /**
   * Update user profile picture and basic info using PATCH with multipart form data
   * @param userId - The ID of the user to update
   * @param profileData - Object containing name, lastname, age, points, and image file
   */
  updateProfilePicture(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    image: File;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('lastname', profileData.lastname);
    formData.append('age', profileData.age.toString());
    formData.append('points', profileData.points.toString());
    formData.append('image', profileData.image);

    const url = `${this.source}/editProfilePicture/${userId}`;
    
    return this.http.patch(url, formData);
  }

  /**
   * Update user profile without image using PUT with JSON data
   * @param userId - The ID of the user to update
   * @param user - User object with updated profile data
   */
  updateProfile(userId: number, user: IUser): Observable<any> {
    const url = `${this.source}/editProfile/${userId}`;
    return this.http.put(url, user);
  }

  /**
   * Update profile picture with success/error handling
   */
  saveProfilePicture(userId: number, profileData: {
    name: string;
    lastname: string;
    age: number;
    points: number;
    image: File;
  }) {
    this.updateProfilePicture(userId, profileData).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Perfil actualizado exitosamente', 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el perfil', 'center', 'top', ['error-snackbar']);
        console.error('Error updating profile picture:', err);
      }
    });
  }

  /**
   * Update profile with success/error handling
   */
  saveProfile(userId: number, user: IUser) {
    this.updateProfile(userId, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', 'Perfil actualizado exitosamente', 'center', 'top', ['success-snackbar']);
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el perfil', 'center', 'top', ['error-snackbar']);
        console.error('Error updating profile:', err);
      }
    });
  }
}
