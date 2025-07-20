import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IChallenge } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ChallengeService extends BaseService<IChallenge> {
    protected override source: string = 'challenges';
    private challengeListSignal = signal<IChallenge[]>([]);
    private authService: AuthService = inject(AuthService);
    private currentUserId: number | null = null;

    get challenges$() {
        return this.challengeListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 5
    }

    public totalItems: any = [];
    private alertService: AlertService = inject(AlertService);

    constructor() {
        super();
        console.log('ChallengeService initialized');
        this.monitorUserChanges();
    }

    private monitorUserChanges() {
        const newUserId = this.authService.getUser()?.id;
        if (this.currentUserId !== null && this.currentUserId !== newUserId) {
            this.clearChallenges();
        }
        this.currentUserId = newUserId || null;
    }

    clearChallenges(): void {
        console.log('Clearing challenges data...');
        this.challengeListSignal.set([]);
        this.search = {
            page: 1,
            size: 5
        };
        this.totalItems = [];
    }

    getMyChallenges(): void {
        console.log('Fetching my challenges...');

        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            console.error('User ID not found');
            return;
        }

        this.findAllWithParamsAndCustomSource(`my-challenges/${userId}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                console.log('My challenges response:', response);
                console.log('My challenges data:', response.data);
                
                if (!response.data || response.data.length === 0) {
                    this.clearChallenges();
                    return;
                }
                
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
                this.challengeListSignal.set(response.data);
            },
            error: (error: any) => {
                console.error('Error fetching my challenges:', error);
                this.alertService.displayAlert('error', 'No se han podido traer los desafíos...', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    getAll() {
        console.log('Fetching all challenges...');

        if (!this.authService.isAdmin()) {
            this.getMyChallenges();
            return;
        }

        this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                console.log('All challenges response:', response);
                console.log('All challenges data:', response.data);
                this.search = { ...this.search, ...response.meta };
                this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
                this.challengeListSignal.set(response.data);
            },
            error: (error: any) => {
                console.error('Error fetching all challenges:', error);
                this.alertService.displayAlert('error', 'No se han podido traer los desafíos...', 'center', 'top', ['error-snackbar']);
            }
        });     
    }

    save(challenge: IChallenge) {
        this.add(challenge).subscribe({
            next: (response: any) => {
                console.log('Challenge saved successfully:', response);
                this.alertService.displayAlert('success', 'Desafío guardado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (error: any) => {
                console.error('Error saving challenge:', error);
                this.alertService.displayAlert('error', 'No se ha podido agregar el desafío', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    update(challenge: IChallenge) {
        this.edit(challenge.id, challenge).subscribe({
            next: (response: any) => {
                console.log('Challenge updated successfully:', response);
                this.alertService.displayAlert('success', 'Desafío actualizado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (error: any) => {
                console.error('Error updating challenge:', error);
                this.alertService.displayAlert('error', 'No se ha podido actualizar el desafío', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    delete(challenge: IChallenge) {
        this.delCustomSource(`${challenge.id}`).subscribe({
            next: (response: any) => {
                console.log('Challenge deleted successfully:', response);
                this.alertService.displayAlert('success', 'Desafío eliminado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (error: any) => {
                console.error('Error deleting challenge:', error);
                this.alertService.displayAlert('error', 'No se ha podido eliminar el desafío', 'center', 'top', ['error-snackbar']);
            }
        });
    }
}
