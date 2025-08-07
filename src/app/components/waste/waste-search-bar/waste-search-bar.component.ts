import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface WasteFilters {
  search?: string;
  userId?: number;
  productType?: string;
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'app-waste-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waste-search-bar.component.html',
  styleUrls: ['./waste-search-bar.component.scss']
})
export class WasteSearchBarComponent {
  @Output() filtersChange = new EventEmitter<WasteFilters>();

  filters: WasteFilters = {
    search: '',
    userId: undefined,
    productType: '',
    startDate: '',
    endDate: ''
  };

  productTypes = [
    { value: 'plastic', label: 'Plástico' },
    { value: 'paper', label: 'Papel' },
    { value: 'glass', label: 'Vidrio' },
    { value: 'metal', label: 'Metal' },
    { value: 'cardboard', label: 'Cartón' },
    { value: 'trash', label: 'Basura General' }
  ];

  onSearchChange(): void {
    this.emitFilters();
  }

  onFilterChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      userId: undefined,
      productType: '',
      startDate: '',
      endDate: ''
    };
    this.emitFilters();
  }

  private emitFilters(): void {
    const cleanFilters = Object.fromEntries(
      Object.entries(this.filters).filter(([_, value]) => 
        value !== '' && value !== undefined && value !== null
      )
    );
    this.filtersChange.emit(cleanFilters);
  }
}
