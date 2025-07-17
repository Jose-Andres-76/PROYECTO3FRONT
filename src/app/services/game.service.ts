import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGame, ISearch } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class GameService extends BaseService<IGame>{
  protected override source: string = 'games';
  private itemListSignal = signal<IGame[]>([]);
  
  get items$() {
    return this.itemListSignal
  }

  public search: ISearch = {
    page: 1,
    size: 5
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  constructor() {
    super();
    console.log('GameService initialized');
  }

  getAll() {
    console.log('Fetching all games...');
    
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Games fetched successfully:', response);
        console.log('Games data:', response.data);
        this.search = {...this.search, ...response.meta };
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        this.itemListSignal.set(response.data);
      },
      error: (error: any) => {
        console.error('Error fetching games:', error);
        this.alertService.displayAlert('error', 'Error al cargar los juegos', 'center', 'top', ['error-snackbar']);
      }
    })
  }
}
