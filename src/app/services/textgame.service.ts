import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ITextGame, ISearch } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})

export class TextGameService extends BaseService<ITextGame> {
    protected override source: string = 'text-games';
    private itemListSignal = signal<ITextGame[]>([]);
    
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
        console.log('TextGameService initialized');
    }
    
    async getOneRandomTextGame(): Promise<{question: string, options: string[], answer: string} | null> {
        console.log('Getting one random text game from backend...');
        
        try {
            const response = await this.http.get<any>(`${this.source}/random`).toPromise();
            console.log('Random text game response:', response);
            
            if (response) {
                return {
                    question: response.question || '',
                    options: response.options || [],
                    answer: response.answer || ''
                };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error: any) {
            console.error('Error fetching random text game:', error);
            this.alertService.displayAlert('error', 'Error al cargar el juego aleatorio', 'center', 'top', ['error-snackbar']);
            return null;
        }
    }
}