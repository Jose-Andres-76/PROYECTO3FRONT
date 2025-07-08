import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';
import { IResponse, IWaste, IWasteCreateRequest, IWasteUpdateRequest, IWasteStats } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class WasteService extends BaseService<IWaste> {
  
  constructor() {
    super();
    this.source = 'waste';
  }

  public getAllWaste(page: number = 0, size: number = 10): Observable<IResponse<IWaste[]>> {
    const params = { page, size };
    return this.findAllWithParams(params);
  }

  public getWasteById(id: number): Observable<IResponse<IWaste>> {
    return this.find(id);
  }

  public getWasteByUserId(userId: number): Observable<IResponse<IWaste[]>> {
    return this.findAllWithParamsAndCustomSource(`user/${userId}`);
  }

  public getWasteByProductType(productType: string): Observable<IResponse<IWaste[]>> {
    return this.findAllWithParamsAndCustomSource(`product-type/${productType}`);
  }

  public createWaste(wasteData: IWasteCreateRequest): Observable<IResponse<IWaste>> {
    return this.add(wasteData);
  }

  public updateWaste(id: number, wasteData: IWasteUpdateRequest): Observable<IResponse<IWaste>> {
    return this.edit(id, wasteData);
  }

  public deleteWaste(id: number): Observable<IResponse<IWaste>> {
    return this.del(id);
  }

  public getWasteStatsByUser(userId: number): Observable<IResponse<IWasteStats>> {
    return this.http.get<IResponse<IWasteStats>>(`${this.source}/stats/user/${userId}`);
  }

  public getWasteStatsByProductType(productType: string): Observable<IResponse<IWasteStats>> {
    return this.http.get<IResponse<IWasteStats>>(`${this.source}/stats/product-type/${productType}`);
  }

  public getRecentWasteByUser(userId: number): Observable<IResponse<IWaste[]>> {
    return this.findAllWithParamsAndCustomSource(`user/${userId}`, { recent: true });
  }

  public searchWasteByAnswer(searchTerm: string): Observable<IResponse<IWaste[]>> {
    const params = { search: searchTerm };
    return this.findAllWithParams(params);
  }

  public getWasteWithFilters(filters: {
    page?: number;
    size?: number;
    userId?: number;
    productType?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<IResponse<IWaste[]>> {
    return this.findAllWithParams(filters);
  }
}
