import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWaste } from '../../../interfaces';

@Component({
  selector: 'app-waste-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waste-table.component.html',
  styleUrls: ['./waste-table.component.scss']
})
export class WasteTableComponent {
  @Input() wasteData: IWaste[] = [];
  @Input() loading = false;

  getStatusClass(productType?: string): string {
    const typeClasses: { [key: string]: string } = {
      'plastic': 'status-plastic',
      'paper': 'status-paper',
      'glass': 'status-glass',
      'metal': 'status-metal',
      'cardboard': 'status-cardboard',
      'trash': 'status-trash'
    };
    return typeClasses[productType || ''] || 'status-other';
  }

  getProductTypeLabel(productType?: string): string {
    const typeLabels: { [key: string]: string } = {
      'plastic': 'Plástico',
      'paper': 'Papel',
      'glass': 'Vidrio',
      'metal': 'Metal',
      'cardboard': 'Cartón',
      'trash': 'Basura General'
    };
    return typeLabels[productType || ''] || productType || '';
  }

  formatDate(date?: Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByWasteId(index: number, waste: IWaste): number {
    return waste.id || index;
  }
}
