import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IChallenge } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

@Injectable({
    providedIn: 'root',
})
export class ChallengeService extends BaseService<IChallenge> {
    protected override source: string = 'challenges';
    private challengeListSignal = signal<IChallenge[]>([]);
    private authService: AuthService = inject(AuthService);
    private currentUserId: number | null = null;
    private profileService = inject(ProfileService);

    get challenges$() {
        return this.challengeListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 3
    }

    public totalItems: any = [];
    private alertService: AlertService = inject(AlertService);

    constructor() {
        super();
   
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
  
        this.challengeListSignal.set([]);
        this.search = {
            page: 1,
            size: 3
        };
        this.totalItems = [];
    }
    getMyChallenges(): void {
        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            console.error('User ID not found');
            return;
        }

        this.findAllWithParamsAndCustomSource(`my-challenges/${userId}`, { 
            page: this.search.page, 
            size: this.search.size 
        }).subscribe({
            next: (response: any) => {
                if (!response.data || response.data.length === 0) {
                    this.clearChallenges();
                    return;
                }
                
                this.search = { 
                    ...this.search, 
                    ...response.meta,
                    pageNumber: response.meta.pageNumber || this.search.page // Ensure pageNumber is set
                };
                
                this.totalItems = Array.from({ 
                    length: this.search.totalPages ? this.search.totalPages : 0 
                }, (_, i) => i + 1);
                
                this.challengeListSignal.set(response.data);
            },
            error: (error: any) => {
                console.error('Error fetching my challenges:', error);
                this.alertService.displayAlert('error', 'No se han podido traer los desafíos...', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    getAllActiveChallenges() {
        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            console.error('User ID not found');
            return;
        }

        this.findAllWithParamsAndCustomSource(`active/${userId}`, { 
            page: this.search.page, 
            size: this.search.size 
        }).subscribe({
            next: (response: any) => {
                if (!response.data || response.data.length === 0) {
                    this.clearChallenges();
                    return;
                }
                
                this.search = { 
                    ...this.search, 
                    ...response.meta,
                    pageNumber: response.meta.pageNumber || this.search.page 
                };
                
                this.totalItems = Array.from({ 
                    length: this.search.totalPages ? this.search.totalPages : 0 
                }, (_, i) => i + 1);
                
                this.challengeListSignal.set(response.data);
                this.profileService.getUserInfoSignal(); 
            },
            error: (error: any) => {
                console.error('Error fetching my Challenges:', error);
                this.alertService.displayAlert('error', 'No se ha podido traer los desafíos..', 'center', 'top', ['error-snackbar']);
            }
        });
    }

   

    save(challenge: IChallenge) {
        this.add(challenge).subscribe({
            next: (response: any) => {
   
                this.alertService.displayAlert('success', 'Desafío guardado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyChallenges();
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
       
                this.alertService.displayAlert('success', 'Desafío actualizado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyChallenges();
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
           
                this.alertService.displayAlert('success', 'Desafío eliminado exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyChallenges();
            },
            error: (error: any) => {
                console.error('Error deleting challenge:', error);
                this.alertService.displayAlert('error', 'No se ha podido eliminar el desafío', 'center', 'top', ['error-snackbar']);
            }
        });
    }


    completeChallenge(challengeId: number): Observable<any> {
        const updatedChallenge = {
            challengeStatus: false
        };

        return this.edit(challengeId, updatedChallenge).pipe(
            tap((response: any) => {
              
                this.alertService.displayAlert('success', 
                    '¡Desafío completado exitosamente!', 'center', 'top', ['success-snackbar']);
            }),
            catchError((error: any) => {
                console.error('Error completing challenge:', error);
                this.alertService.displayAlert('error', 
                    'Error completando el desafío', 'center', 'top', ['error-snackbar']);
                return throwError(() => error);
            })
        );
    }

    getActiveChallengesByUserAndGame(userId: number, gameId?: number): Observable<any> {
        return this.findAllWithParamsAndCustomSource(`my-challenges/${userId}`, {}).pipe(
            map((response: any) => {
                const challenges = response.data || [];
                
                let activeChallenges = challenges.filter((challenge: IChallenge) => 
                    challenge.challengeStatus === true
                );
                
                if (gameId) {
                    activeChallenges = activeChallenges.filter((challenge: IChallenge) => 
                        challenge.game?.id === gameId
                    );
                }
                
                return activeChallenges;
            }),
            catchError((error: any) => {
                console.error('Error fetching active challenges:', error);
                return throwError(() => error);
            })
        );
    }

    changePage(page: number): void {
        this.search.page = page;
        this.search.pageNumber = page; 
    }
}

