import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GarbageScannerFormComponent } from '../../components/garbage-scanner/garbage-scanner-form/garbage-scanner-form.component';
import { GarbageScannerChatComponent } from '../../components/garbage-scanner/garbage-scanner-chat/garbage-scanner-chat.component';
import { ClasificacionResponse } from '../../services/clasificacion-basura.service';
import { WasteService } from '../../services/waste.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { IWasteCreateRequest } from '../../interfaces';

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

  private wasteService = inject(WasteService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public isScanning = false;
  public currentResult: any = null;
  public isSavingResult = false;

  public handleScanStart() {
    this.isScanning = true;
    this.currentResult = null;
  }

  public handleScanComplete(result: ClasificacionResponse) {
    this.isScanning = false;
    this.currentResult = result;
    this.saveWasteResult(result);
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

  private saveWasteResult(result: ClasificacionResponse) {
    const currentUser = this.authService.getUser();
    if (!currentUser || !currentUser.id) {
      console.error('Usuario no autenticado');
      return;
    }
    this.isSavingResult = true;
    const wasteData: IWasteCreateRequest = {
      userId: currentUser.id,
      productType: result.clase || 'unknown',
      answer: this.generateAnswerFromResult(result)
    };
    this.wasteService.createWaste(wasteData).subscribe({
      next: () => {
        this.isSavingResult = false;
        this.alertService.displayAlert('success', 'Resultado guardado exitosamente');
      },
      error: (error) => {
        this.isSavingResult = false;
        console.error('Error al guardar resultado:', error);
        this.alertService.displayAlert('error', 'Error al guardar el resultado');
      }
    });
  }

  private generateAnswerFromResult(result: ClasificacionResponse): string {
    const type = this.getTypeInfo(result.clase);
    const confidence = (result.confianza * 100).toFixed(1);
    return `Producto identificado como ${type.name} con ${confidence}% de confianza. ${
      result.es_reciclable 
        ? 'Este material es reciclable. Deposítalo en el contenedor correspondiente.' 
        : 'Este material no es reciclable. Deposítalo en el contenedor de basura general.'
    }`;
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
}
