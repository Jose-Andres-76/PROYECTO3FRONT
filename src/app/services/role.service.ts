import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRole, ISearch } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService<IRole> {
  protected override source: string = 'roles';
  private itemListSignal = signal<IRole[]>([]);
  
  get items$() {
    return this.itemListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 3
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  constructor() {
    super();
    console.log('RoleService initialized');
  }

  getAll() {
    console.log('Fetching all roles...');
    
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Roles fetched successfully:', response);
        this.search = {...this.search, ...response.meta };
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        this.itemListSignal.set(response.data);
      },
      error: (error: any) => {
        console.error('Error fetching roles:', error);
        this.alertService.displayAlert('error', 'Error al cargar los roles', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}