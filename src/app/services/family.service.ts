import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISearch, IFamily } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root',
})
export class FamilyService extends BaseService<IFamily> {
    protected override source: string = 'families';
    private familyListSignal = signal<IFamily[]>([]);
    get families$() {
        return this.familyListSignal;
    }
    public search: ISearch = { 
        page: 1,
        size: 5
    }
    public totalItems: any = [];
    private alertService: AlertService = inject(AlertService);

    getAll() {
        console.log('🔍 Fetching families...'); // Add debugging
        this.findAllWithParams({ page: this.search.page, size: this.search.size}).subscribe({
            next: (response: any) => {
                console.log('✅ Families response:', response); // Add debugging
                console.log('📊 Families data:', response.data); // Add debugging
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i+1);
                this.familyListSignal.set(response.data);

                //with the sonId and fatherId, we can get the full user with the respective id
                this.familyListSignal.update(families => {
                    return families.map(family => {
                        if (family.idSon) {
                            family.son = response.data.find((user: IFamily) => user.id === family.idSon);
                        }
                        if (family.idFather) {
                            family.idFather = response.data.find((user: IFamily) => user.id === family.idFather);
                        }
                        return family;
                    });
                });
            },
            error: (err: any) => {
                console.error('❌ Error fetching families:', err); // Enhanced error logging
                this.alertService.displayAlert('error', 'Error loading families', 'center', 'top', ['error-snackbar']);
            }
        });
    }

    

    // ...existing code...
    save(family: IFamily) {
        this.add(family).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred adding the family','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    update(family: IFamily) {
        this.editCustomSource(`${family.id}`, family).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred updating the family','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }

    delete(family: IFamily) {
        this.delCustomSource(`${family.id}`).subscribe({
            next: (response: any) => {
                this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
                this.getAll();
            },
            error: (err: any) => {
                this.alertService.displayAlert('error', 'An error occurred deleting the family','center', 'top', ['error-snackbar']);
                console.error('error', err);
            }
        });
    }
}