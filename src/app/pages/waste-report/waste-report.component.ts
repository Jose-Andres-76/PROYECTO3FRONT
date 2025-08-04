import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteSearchBarComponent, WasteFilters } from '../../components/waste/waste-search-bar/waste-search-bar.component';
import { WasteTableComponent } from '../../components/waste/waste-table/waste-table.component';
import { WasteStatsComponent } from '../../components/waste/waste-stats/waste-stats.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { IWaste, ISearch } from '../../interfaces';
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
  pagination: ISearch = {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    pageSize: 10
  };

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadWasteData();
  }

  onFiltersChange(filters: WasteFilters): void {
    this.filters = filters;
    this.pagination.page = 0;
    this.applyFiltersAndPagination();
  }

  onPageChange(page: number): void {
    this.pagination.page = page;
    this.applyFiltersAndPagination();
  }

  onPageSizeChange(size: number): void {
    this.pagination.size = size;
    this.pagination.page = 0;
    this.applyFiltersAndPagination();
  }

  private loadWasteData(): void {
    this.loading = true;
    
    this.wasteService.getAllWaste(0, 1000).subscribe({
      next: (response: any) => {
        let wasteArray: any[] = [];
        
        if (response?.data && Array.isArray(response.data)) {
          wasteArray = response.data;
        } else if (response?.data?.content && Array.isArray(response.data.content)) {
          wasteArray = response.data.content;
        } else if ((response as any)?.content && Array.isArray((response as any).content)) {
          wasteArray = (response as any).content;
        } else if (Array.isArray(response)) {
          wasteArray = response;
        }
        
        this.allWasteData = wasteArray;
        this.applyFiltersAndPagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading waste data:', error);
        this.allWasteData = [];
        this.wasteData = [];
        this.pagination.totalElements = 0;
        this.pagination.totalPages = 0;
        this.loading = false;
      }
    });
  }

  private applyFiltersAndPagination(): void {
    let filteredData = [...this.allWasteData];

    if (this.filters.search) {
      filteredData = filteredData.filter(waste => 
        waste.answer?.toLowerCase().includes(this.filters.search!.toLowerCase())
      );
    }

    if (this.filters.userId) {
      filteredData = filteredData.filter(waste => 
        waste.userId === this.filters.userId || waste.user?.id === this.filters.userId
      );
    }

    if (this.filters.productType) {
      filteredData = filteredData.filter(waste => 
        waste.productType === this.filters.productType
      );
    }

    if (this.filters.startDate) {
      const startDate = new Date(this.filters.startDate);
      filteredData = filteredData.filter(waste => {
        if (!waste.createdAt) return false;
        const wasteDate = new Date(waste.createdAt);
        return wasteDate >= startDate;
      });
    }

    if (this.filters.endDate) {
      const endDate = new Date(this.filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(waste => {
        if (!waste.createdAt) return false;
        const wasteDate = new Date(waste.createdAt);
        return wasteDate <= endDate;
      });
    }

    this.pagination.totalElements = filteredData.length;
    this.pagination.totalPages = Math.ceil(filteredData.length / (this.pagination.size || 10));

    const startIndex = (this.pagination.page || 0) * (this.pagination.size || 10);
    const endIndex = startIndex + (this.pagination.size || 10);
    this.wasteData = filteredData.slice(startIndex, endIndex);
  }
}
