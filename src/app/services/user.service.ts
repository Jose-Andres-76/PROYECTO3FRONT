import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  apiUrl: string = 'http://localhost:8080/users';
  get users$() {
    return this.userListSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  }
  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        console.log('User saved successfully:', response);
        this.alertService.displayAlert('success', 'Usuario guardado exitosamente', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error guardando el usuario','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        console.log('User updated successfully:', response);
        this.alertService.displayAlert('success', 'Usuario actualizado exitosamente', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el usuario','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  updateFamilyMember(user: IUser) {
    const userToUpdate = {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        points: user.points,
        role: user.role || {
            id: 2,
            name: 'ROLE_SON',
            description: 'Son Role'
        }
    };
    
    console.log('Updating family member via service:', userToUpdate);
    
    this.editCustomSource(`${user.id}`, userToUpdate).subscribe({
        next: (response: any) => {
            console.log('Update response:', response);
            this.alertService.displayAlert('success', 'Miembro de familia actualizado exitosamente', 'center', 'top', ['success-snackbar']);
        },
        error: (err: any) => {
            console.error('Update error:', err);
            this.alertService.displayAlert('error', 'Ocurrió un error actualizando el miembro de familia','center', 'top', ['error-snackbar']);
        }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        console.log('User deleted successfully:', response);
        this.alertService.displayAlert('success', 'Usuario eliminado exitosamente', 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'Ocurrió un error actualizando el usuario','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  updatePoints(userId: number, points: number) {
  return this.editCustomSource2(`${userId}/points`, { points });
  }
}
