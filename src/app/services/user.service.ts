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
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred saving the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(user: IUser) {
    this.editCustomSource(`${user.id}`, user).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred updating the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  updateFamilyMember(user: IUser) {
    // Create a user object with the provided role
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
            this.alertService.displayAlert('success', response.message || 'Family member updated successfully', 'center', 'top', ['success-snackbar']);
        },
        error: (err: any) => {
            console.error('Update error:', err);
            this.alertService.displayAlert('error', 'An error occurred updating the family member','center', 'top', ['error-snackbar']);
        }
    });
  }

  delete(user: IUser) {
    this.delCustomSource(`${user.id}`).subscribe({
      next: (response: any) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred deleting the user','center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
