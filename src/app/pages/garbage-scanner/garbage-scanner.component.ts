import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GarbageScannerFormComponent } from '../../components/garbage-scanner/garbage-scanner-form/garbage-scanner-form.component';
import { GarbageScannerChatComponent } from '../../components/garbage-scanner/garbage-scanner-chat/garbage-scanner-chat.component';
import { ClasificacionBasuraService, ClasificacionResponse } from '../../services/clasificacion-basura.service';

@Component({
  selector: 'app-garbage-scanner-page',
  standalone: true,
  imports: [
    CommonModule, 
    GarbageScannerFormComponent, 
    GarbageScannerChatComponent
  ],
  templateUrl: './garbage-scanner.component.html',
  styleUrl: './garbage-scanner.component.scss'
})
export class GarbageScannerPageComponent {
  @ViewChild('scannerForm') scannerForm!: GarbageScannerFormComponent;

  private clasificacionService = inject(ClasificacionBasuraService);

  public isScanning = false;
  public currentResult: any = null;

  public handleScanStart() {
    this.isScanning = true;
    this.currentResult = null;
  }

  public handleScanComplete(result: ClasificacionResponse) {
    this.isScanning = false;
    this.currentResult = result;
    console.log('Resultado recibido en página principal:', result);
  }

  public handleReset() {
    this.currentResult = null;
    this.isScanning = false;
  }

  public resetScanner() {
    if (this.scannerForm) {
      this.scannerForm.scanNewImage();
    }
    this.handleReset();
  }

  public getTypeInfo(clase: string) {
    const types: any = {
      'cardboard': { id: 'cardboard', name: 'Cartón', color: '#8B4513', icon: '📦' },
      'glass': { id: 'glass', name: 'Vidrio', color: '#45b7d1', icon: '🍶' },
      'metal': { id: 'metal', name: 'Metal', color: '#96ceb4', icon: '🔩' },
      'paper': { id: 'paper', name: 'Papel', color: '#4ecdc4', icon: '📄' },
      'plastic': { id: 'plastic', name: 'Plástico', color: '#ff6b6b', icon: '♻️' },
      'trash': { id: 'trash', name: 'Basura General', color: '#6c757d', icon: '🗑️' }
    };
    
    return types[clase] || types['trash'];
  }

  public getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'danger';
  }

  public getChatContext(): string {
    if (!this.currentResult) return '';
    
    const type = this.getTypeInfo(this.currentResult.clase);
    return `Tipo identificado: ${type.name}. Reciclable: ${this.currentResult.es_reciclable ? 'Sí' : 'No'}. Confianza: ${(this.currentResult.confianza * 100).toFixed(1)}%.`;
  }
}
