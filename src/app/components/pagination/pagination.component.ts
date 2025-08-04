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
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalElements: number = 0;
  @Input() customCall: boolean = false;
  @Input() showPageSizeSelector: boolean = true;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  
  @Output() callCustomPaginationMethod = new EventEmitter();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  onPage(pPage: number) {
    if (this.service) {
      this.service.search.page = pPage;
      if (this.customCall) {
        this.callCustomPaginationMethod.emit();
      } else {
        this.service.getAll();
      }
    } else {
      this.pageChange.emit(pPage);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSizeChange.emit(size);
  }

  onPageSizeSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.onPageSizeChange(+select.value);
  }

  getPaginationInfo(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
    return `${start}-${end} de ${this.totalElements}`;
  }

  getVisiblePages(): number[] {
    const maxVisible = 5;
    const pages: number[] = [];
    
    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
