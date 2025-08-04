import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteSearchBarComponent, WasteFilters } from '../../components/waste/waste-search-bar/waste-search-bar.component';
import { WasteTableComponent } from '../../components/waste/waste-table/waste-table.component';
import { WasteStatsComponent } from '../../components/waste/waste-stats/waste-stats.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IWaste } from '../../interfaces';
import { WasteService } from '../../services/waste.service';

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
export class WasteReportComponent implements OnInit {
  wasteData: IWaste[] = [];
  allWasteData: IWaste[] = [];
  loading = false;
  filters: WasteFilters = {};
  
  wasteReportService = {
    search: {
      _page: 1,
      get page() { return this._page; },
      set page(value: number) { 
        this._page = value; 
        this.pageNumber = value; 
      },
      pageNumber: 1,
      size: 10
    },
    totalItems: [] as number[],
    getAll: () => this.loadWasteData()
  };

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadWasteData();
  }

  onFiltersChange(filters: WasteFilters): void {
    this.filters = filters;
    this.wasteReportService.search.page = 1;
    this.loadWasteData();
  }

  private loadWasteData(): void {
    this.loading = true;
    const { page, size } = this.wasteReportService.search;
    
    this.wasteService.getAllWaste(page - 1, size).subscribe({
      next: (response: any) => {
        const { wasteArray, totalPages } = this.parseResponse(response);
        this.allWasteData = wasteArray;
        this.applyLocalFilters();
        this.wasteReportService.totalItems = Array.from({length: totalPages}, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => {
        this.wasteData = [];
        this.allWasteData = [];
        this.wasteReportService.totalItems = [];
        this.loading = false;
      }
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
    const hasFilters = this.filters && Object.keys(this.filters).length > 0;
    
    if (!hasFilters) {
      this.wasteData = this.allWasteData;
      return;
    }

    this.wasteData = this.allWasteData.filter(waste => {
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
    });
  }
}
