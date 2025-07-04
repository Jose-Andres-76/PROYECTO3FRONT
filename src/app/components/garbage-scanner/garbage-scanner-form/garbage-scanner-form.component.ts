import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClasificacionBasuraService, ClasificacionResponse } from '../../../services/clasificacion-basura.service';
import { AlertService } from '../../../services/alert.service';
import { CameraService } from '../../../services/camera.service';
import { FileUtilsService } from '../../../services/file-utils.service';

@Component({
  selector: 'app-garbage-scanner-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garbage-scanner-form.component.html',
  styleUrl: './garbage-scanner-form.component.scss'
})
export class GarbageScannerFormComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() isLoading = false;
  @Output() onScanStart = new EventEmitter<void>();
  @Output() onScanComplete = new EventEmitter<ClasificacionResponse>();
  @Output() onReset = new EventEmitter<void>();

  private clasificacionService = inject(ClasificacionBasuraService);
  private alertService = inject(AlertService);
  private cameraService = inject(CameraService);
  private fileUtils = inject(FileUtilsService);

  public activeTab: 'upload' | 'camera' = 'upload';
  public isCameraActive = false;
  public isAnalyzing = false;
  public hasResult = false;
  public isDragOver = false;
  public stream: MediaStream | null = null;
  public selectedImage: string | null = null;
  public capturedImage: string | null = null;
  public selectedFile: File | null = null;

  ngOnDestroy() {
    this.cameraService.stopCamera(this.videoElement);
  }

  public setActiveTab(tab: 'upload' | 'camera') {
    this.activeTab = tab;
    this.clearAll();
    
    if (tab === 'camera') {
      console.log('📱 Pestaña de cámara activada, esperando acción del usuario');
    } else {
      this.cameraService.stopCamera(this.videoElement);
    }
  }

  // File Upload Methods
  public triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validation = this.fileUtils.validateFile(file);
      if (validation.isValid) {
        this.selectedFile = file;
        this.fileUtils.previewImage(file).then(preview => {
          this.selectedImage = preview;
        }).catch(() => this.showError('Error al previsualizar imagen'));
      } else {
        this.showError(validation.error!);
      }
    }
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  public onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const validation = this.fileUtils.validateFile(files[0]);
      if (validation.isValid) {
        this.selectedFile = files[0];
        this.fileUtils.previewImage(files[0]).then(preview => {
          this.selectedImage = preview;
        }).catch(() => this.showError('Error al previsualizar imagen'));
      } else {
        this.showError(validation.error!);
      }
    }
  }

  public clearSelection() {
    this.selectedImage = null;
    this.selectedFile = null;
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  // Camera Methods
  public async startCamera() {
    try {
      console.log('🎥 Iniciando cámara...');
      if (this.activeTab !== 'camera') this.activeTab = 'camera';
      
      this.stream = await this.cameraService.startCamera(this.videoElement);
      this.isCameraActive = true;
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      this.showError(this.cameraService.getCameraErrorMessage(error));
    }
  }

  public stopCamera() {
    this.cameraService.stopCamera(this.videoElement);
    this.isCameraActive = false;
    this.stream = null;
  }

  public captureImage() {
    if (!this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) {
      this.showError('Elementos de cámara no disponibles');
      return;
    }

    try {
      this.capturedImage = this.cameraService.captureImage(this.videoElement, this.canvasElement);
    } catch (error) {
      this.showError('Error al capturar imagen');
    }
  }

  // Analysis Methods
  public async analyzeImage() {
    const fileToAnalyze = this.selectedFile || this.createFileFromCapture();
    if (!fileToAnalyze) {
      this.showError('No hay imagen para analizar');
      return;
    }

    this.isAnalyzing = true;
    this.onScanStart.emit();

    try {
      const result = await this.clasificacionService.clasificarBasura(fileToAnalyze).toPromise() as ClasificacionResponse;
      this.hasResult = true;
      this.onScanComplete.emit(result);
    } catch (error) {
      console.error('Error al analizar imagen:', error);
      this.showError('Error al analizar la imagen. Inténtalo de nuevo.');
    } finally {
      this.isAnalyzing = false;
    }
  }

  private createFileFromCapture(): File | null {
    return this.capturedImage ? this.fileUtils.createFileFromDataURL(this.capturedImage) : null;
  }

  public clearCapture() {
    this.capturedImage = null;
  }

  public scanNewImage() {
    this.hasResult = false;
    this.clearAll();
    this.onReset.emit();
  }

  private clearAll() {
    this.clearSelection();
    this.clearCapture();
  }

  private showError(message: string) {
    this.alertService.displayAlert('error', message);
  }
}
