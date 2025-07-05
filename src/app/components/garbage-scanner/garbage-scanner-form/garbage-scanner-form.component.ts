import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasificacionBasuraService, ClasificacionResponse } from '../../../services/clasificacion-basura.service';
import { AlertService } from '../../../services/alert.service';
import { CameraService } from '../../../services/camera.service';
import { FileUtilsService } from '../../../services/file-utils.service';
import { GeminiChatService, ChatMessage } from '../../../services/gemini-chat.service';

// Import new components
import { ScannerTabsComponent } from './components/scanner-tabs/scanner-tabs.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { CameraCaptureComponent } from './components/camera-capture/camera-capture.component';
import { EcoChatComponent } from './components/eco-chat/eco-chat.component';
import { AnalysisLoadingComponent } from './components/analysis-loading/analysis-loading.component';
import { AnalyzedResultComponent } from './components/analyzed-result/analyzed-result.component';

@Component({
  selector: 'app-garbage-scanner-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ScannerTabsComponent,
    ImageUploadComponent,
    CameraCaptureComponent,
    EcoChatComponent,
    AnalysisLoadingComponent,
    AnalyzedResultComponent
  ],
  templateUrl: './garbage-scanner-form.component.html',
  styleUrl: './garbage-scanner-form.component.scss'
})
export class GarbageScannerFormComponent implements OnDestroy {
  @Input() isLoading = false;
  @Output() onScanStart = new EventEmitter<void>();
  @Output() onScanComplete = new EventEmitter<ClasificacionResponse>();
  @Output() onReset = new EventEmitter<void>();

  private clasificacionService = inject(ClasificacionBasuraService);
  private alertService = inject(AlertService);

  public activeTab: 'upload' | 'camera' | 'chat' = 'upload';
  public isAnalyzing = false;
  public hasResult = false;
  public selectedImage: string | null = null;
  public capturedImage: string | null = null;
  public selectedFile: File | null = null;

  ngOnDestroy() {
  }

  onTabChanged(tab: 'upload' | 'camera' | 'chat') {
    this.activeTab = tab;
    this.clearAll();
  }

  onImageSelected(data: { file: File, preview: string }) {
    this.selectedFile = data.file;
    this.selectedImage = data.preview;
  }

  onImageCaptured(imageData: string) {
    this.capturedImage = imageData;
  }

  onAnalyzeRequested() {
    this.analyzeImage();
  }

  onClearRequested() {
    this.clearAll();
  }

  onScanNewRequested() {
    this.scanNewImage();
  }

  private clearAll() {
    this.selectedImage = null;
    this.capturedImage = null;
    this.selectedFile = null;
    this.hasResult = false;
  }

  private async analyzeImage() {
    if (!this.selectedFile && !this.capturedImage) return;

    this.isAnalyzing = true;
    this.onScanStart.emit();

    try {
      let response: ClasificacionResponse | undefined;
      
      if (this.selectedFile) {
        response = await this.clasificacionService.clasificarBasura(this.selectedFile).toPromise();
      } else if (this.capturedImage) {
        const blob = this.dataURLtoBlob(this.capturedImage);
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        response = await this.clasificacionService.clasificarBasura(file).toPromise();
      } else {
        throw new Error('No image available for analysis');
      }

      if (response) {
        this.hasResult = true;
        this.onScanComplete.emit(response);
      } else {
        throw new Error('No response received from analysis service');
      }
    } catch (error) {
      console.error('Error al analizar imagen:', error);
      this.alertService.displayAlert('error', 'Error al analizar la imagen');
    } finally {
      this.isAnalyzing = false;
    }
  }

  public scanNewImage() {
    this.clearAll();
    this.onReset.emit();
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private showError(message: string) {
    this.alertService.displayAlert('error', message);
  }
}
