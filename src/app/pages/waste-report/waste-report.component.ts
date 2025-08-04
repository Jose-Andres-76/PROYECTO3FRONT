import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteSearchBarComponent, WasteFilters } from '../../components/waste/waste-search-bar/waste-search-bar.component';
import { WasteTableComponent } from '../../components/waste/waste-table/waste-table.component';
import { WasteStatsComponent } from '../../components/waste/waste-stats/waste-stats.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IWaste } from '../../interfaces';
import { WasteService } from '../../services/waste.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-waste-report',
  standalone: true,
  imports: [
    CommonModule,
    WasteSearchBarComponent,
    WasteTableComponent,
    WasteStatsComponent,
    PaginationComponent
  ],
  templateUrl: './waste-report.component.html',
  styleUrls: ['./waste-report.component.scss']
})
export class WasteReportComponent implements OnInit, OnDestroy {
  wasteData: IWaste[] = [];
  allWasteData: IWaste[] = [];
  filteredData: IWaste[] = [];
  loading = false;
  filters: WasteFilters = {};
  isFiltered = false;
  
  private destroy$ = new Subject<void>();
  private readonly DEFAULT_PAGE_SIZE = 10;
  private readonly MAX_FILTER_SIZE = 1000;
  
  wasteReportService = {
    search: {
      _page: 1,
      get page() { return this._page; },
      set page(value: number) { 
        this._page = value; 
        this.pageNumber = value; 
      },
      pageNumber: 1,
      size: this.DEFAULT_PAGE_SIZE
    },
    totalItems: [] as number[],
    getAll: () => this.handlePageChange()
  };

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadWasteData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFiltersChange(filters: WasteFilters): void {
    this.filters = filters;
    this.wasteReportService.search.page = 1;
    this.isFiltered = Object.keys(filters).length > 0;
    
    this.isFiltered ? this.loadAllDataForFiltering() : this.loadWasteData();
  }

  private handlePageChange(): void {
    this.isFiltered ? this.applyLocalPagination() : this.loadWasteData();
  }

  private loadWasteData(): void {
    if (this.loading) return; 
    
    this.loading = true;
    const { page, size } = this.wasteReportService.search;
    
    this.wasteService.getAllWaste(page - 1, size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const { wasteArray, totalPages } = this.parseResponse(response);
          this.allWasteData = wasteArray;
          
          if (!this.isFiltered) {
            this.wasteData = wasteArray;
            this.wasteReportService.totalItems = this.generatePageArray(totalPages);
          }
          
          this.loading = false;
        },
        error: () => this.handleError()
      });
  }

  private loadAllDataForFiltering(): void {
    if (this.loading) return;
    
    this.loading = true;
    
    this.wasteService.getAllWasteForFiltering()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const { wasteArray } = this.parseResponse(response);
          this.allWasteData = wasteArray;
          this.applyLocalFilters();
          this.loading = false;
        },
        error: () => this.handleError()
      });
  }

  private parseResponse(response: any): { wasteArray: IWaste[], totalPages: number } {
    if (response?.data && Array.isArray(response.data) && response?.meta) {
      return {
        wasteArray: response.data,
        totalPages: response.meta.totalPages || 0
      };
    }
    if (response?.content && Array.isArray(response.content)) {
      return {
        wasteArray: response.content,
        totalPages: response.totalPages || 0
      };
    }
    if (Array.isArray(response?.data)) {
      return {
        wasteArray: response.data,
        totalPages: 1
      };
    }
    return { wasteArray: [], totalPages: 0 };
  }

  private applyLocalFilters(): void {
    this.filteredData = this.allWasteData.filter(waste => this.matchesFilters(waste));
    this.applyLocalPagination();
  }

  private matchesFilters(waste: IWaste): boolean {
    const { search, userId, productType, startDate, endDate } = this.filters;
    
    if (search && !waste.answer?.toLowerCase().includes(search.toLowerCase())) return false;
    if (userId && waste.userId !== userId && waste.user?.id !== userId) return false;
    if (productType && waste.productType !== productType) return false;
    
    if (startDate || endDate) {
      if (!waste.createdAt) return false;
      const wasteDate = new Date(waste.createdAt);
      
      if (startDate && wasteDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (wasteDate > end) return false;
      }
    }
    
    return true;
  }

  private applyLocalPagination(): void {
    const { page, size } = this.wasteReportService.search;
    const dataToUse = this.isFiltered ? this.filteredData : this.allWasteData;
    
    const startIndex = (page - 1) * size;
    this.wasteData = dataToUse.slice(startIndex, startIndex + size);
    
    const totalPages = Math.ceil(dataToUse.length / size) || 1;
    this.wasteReportService.totalItems = this.generatePageArray(totalPages);
  }

  private generatePageArray(totalPages: number): number[] {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  private handleError(): void {
    this.wasteData = [];
    this.allWasteData = [];
    this.filteredData = [];
    this.wasteReportService.totalItems = [];
    this.loading = false;
  }
}