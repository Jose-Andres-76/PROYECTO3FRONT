import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IFamily } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class FamilyService extends BaseService<IFamily> {
    protected override source: string = 'families';
    private familyListSignal = signal<IFamily[]>([]);
    private authService: AuthService = inject(AuthService);
    private currentUserId: number | null = null;
    
    get families$() {
        return this.familyListSignal;
    }
    public search: ISearch = { 
        page: 1,
        size: 5
    }
    public totalItems: any = [];
    private alertService: AlertService = inject(AlertService);

    constructor() {
        super();
        console.log('FamilyService initialized');
        this.monitorUserChanges();
    }

    private monitorUserChanges() {
        const newUserId = this.authService.getUser()?.id;
        if (this.currentUserId !== null && this.currentUserId !== newUserId) {
            this.clearFamilies();
        }
        this.currentUserId = newUserId || null;
    }

    clearFamilies(): void {
        console.log('Clearing families data...');
        this.familyListSignal.set([]);
        this.search = { 
            page: 1,
            size: 5
        };
        this.totalItems = [];
    }

    getMyFamilies() {
        console.log('Fetching my families...');

        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            console.error('User ID not found');
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            return;
        }

        this.findAllWithParamsAndCustomSource(`my-family/${userId}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                console.log('My families response:', response);
                console.log('My families data:', response.data);

                if (!response.data || response.data.length === 0) {
                    this.clearFamilies();
                    return;
                }

                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
                
                this.familyListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error fetching my families:', err);
                this.alertService.displayAlert('error', 'Error cargando tus miembros de familia.', 'center', 'top', ['error-snackbar']);
                this.clearFamilies(); 
            }
        });
    }

    getAll() {
        console.log('Fetching families...');
        
        if (!this.authService.isAdmin()) {
            this.getMyFamilies();
            return;
        }

        this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
            next: (response: any) => {
                console.log('Families response:', response);
                console.log('Families data:', response.data);
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
                this.familyListSignal.set(response.data);
            },
            error: (err: any) => {
                console.error('Error fetching families:', err);
                this.alertService.displayAlert('error', 'Error cargando miembros', 'center', 'top', ['error-snackbar']);
            }
        });
    }
    
    save(family: IFamily) {
        this.add(family).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', 'Miembro agregado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'Ocurrió un error agregando el miembro','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    update(family: IFamily) {
        this.editCustomSource(`${family.id}`, family).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', 'Miembro actualizado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'Ocurrió un error actualizando el miembro','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    delete(family: IFamily) {
        this.familyListSignal.update(families => 
            families.filter(f => f.id !== family.id)
        );

        this.delCustomSource(`${family.id}`).subscribe({
            next: (response: any) => {
                console.log('Delete response:', response);
                this.alertService.displayAlert('success', 'Miembro eliminado exitosamente', 'center', 'top', ['success-snackbar']);
                setTimeout(() => {
                    this.getAll();
                }, 500);
            },
            error: (err: any) => {
                this.getAll();
                this.alertService.displayAlert('error', 'Un error ocurrió eliminando el miembro. Asegúrese que no hay recompensas asignadas al miembro.','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }
}