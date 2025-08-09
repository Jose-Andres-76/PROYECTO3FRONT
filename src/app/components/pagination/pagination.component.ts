import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() service: any;
  @Output() callCustomPaginationMethod = new EventEmitter();
  @Input() customCall: boolean = false;
  
  onPage(pPage: number) {
    this.service.search.page = pPage;
    this.service.search.pageNumber = pPage;
    
    if (this.customCall) {
      this.callCustomPaginationMethod.emit();
    } else {
      this.service.getAll();
    }
  }

  getCurrentPage(): number {
    return this.service.search.pageNumber || this.service.search.page || 1;
  }

  getTotalPages(): number {
    return this.service.search.totalPages || this.service.totalItems.length || 0;
  }
}