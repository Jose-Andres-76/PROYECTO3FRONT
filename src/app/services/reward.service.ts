import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IReward } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RewardService extends BaseService<IReward> {
    protected override source: string = 'rewards';
    private rewardListSignal = signal<IReward[]>([]);
    private authService: AuthService = inject(AuthService);
    private currentUserId: number | null = null;

    get rewards$() {
        return this.rewardListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 5
    }

    public totalItems: any = [];
    private alertService: AlertService = inject(AlertService);

    constructor() {
        super();
        console.log('RewardService initialized');
        this.monitorUserChanges();
    }

    private monitorUserChanges() {
        const newUserId = this.authService.getUser()?.id;
        if (this.currentUserId !== null && this.currentUserId !== newUserId) {
            this.clearRewards();
        }
        this.currentUserId = newUserId || null;
    }
    clearRewards(): void {
        console.log('Clearing rewards data...');
        this.rewardListSignal.set([]);
        this.search = {
            page: 1,
            size: 5
        };
        this.totalItems = [];
    }

    getMyRewards(): void {
        console.log('Fetching my rewards...');

        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            console.error('User ID not found');
            return;
        }

        this.findAllWithParamsAndCustomSource(`my-family-rewards/${userId}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                console.log('My rewards response:', response);
                console.log('My rewards data:', response.data);
                
                if (!response.data || response.data.length === 0) {
                    this.clearRewards();
                    return;
                }
                
            this.search = { ...this.search, ...response.meta };
            this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
            this.rewardListSignal.set(response.data);
            },
            error: (error: any) => {
                console.error('Error fetching my rewards:', error);
                this.alertService.displayAlert('error', 'No se ha podido traer recompensas..', 'center', 'top', ['error-snackbar']);
            }
        });
    }

     getAllActiveRewards(): void {
        console.log('Fetching my rewards...');

        this.monitorUserChanges();
        const userId = this.authService.getUser()?.id;
        if (!userId) {
            this.alertService.displayAlert('error', 'Usuario no encontrado...', 'center', 'top', ['error-snackbar']);
            console.error('User ID not found');
            return;
        }

        this.findAllWithParamsAndCustomSource(`active/${userId}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                console.log('My rewards response:', response);
                console.log('My rewards data:', response.data);
                
                if (!response.data || response.data.length === 0) {
                    this.clearRewards();
                    return;
                }
                
            this.search = { ...this.search, ...response.meta };
            this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
            this.rewardListSignal.set(response.data);
            },
            error: (error: any) => {
                console.error('Error fetching my rewards:', error);
                this.alertService.displayAlert('error', 'No se ha podido traer recompensas..', 'center', 'top', ['error-snackbar']);
            }
        });
    }




    save(reward: IReward){
        this.add(reward).subscribe({
            next: (response: any) => {
                console.log('Reward saved successfully:', response);
                this.alertService.displayAlert('success', 'Recompensa guardada exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyRewards();
            },
            error: (error: any) => {
                console.error('Error saving reward:', error);
                this.alertService.displayAlert('error', 'No se ha podido agregar tu recompensa', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    update(reward: IReward) {
        this.edit(reward.id, reward).subscribe({
            next: (response: any) => {
                console.log('Reward updated successfully:', response);
                this.alertService.displayAlert('success', 'Recompensa actualizada exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyRewards();
            },
            error: (error: any) => {
                console.error('Error updating reward:', error);
                this.alertService.displayAlert('error', 'No se ha podido actualizar la recompensa', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    delete(reward: IReward) {
        this.delCustomSource(`${reward.id}`).subscribe({
            next: (response: any) => {
                console.log('Reward deleted successfully:', response);
                this.alertService.displayAlert('success', 'Recompensa eliminada exitosamente', 'center', 'top', ['success-snackbar']);
                this.getMyRewards();
            },
            error: (error: any) => {
                console.error('Error deleting reward:', error);
                this.alertService.displayAlert('error', 'No se ha podido eliminar recompensa', 'center', 'top', ['error-snackbar']);
            }
        });
    }
    



    redeemRewards(reward: IReward): void {
        this.redeemPoint(`redeem/${reward.id}`, { page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', 'Recompensa eliminada exitosamente', 'center', 'top', ['success-snackbar']);
                this.getAllActiveRewards(); 
            },
            error: (error: any) => {
                console.error('Error fetching my rewards:', error);
                this.alertService.displayAlert('error', 'No se ha podido Redimir su recompensas..', 'center', 'top', ['error-snackbar']);
            }
        });
    }
}


