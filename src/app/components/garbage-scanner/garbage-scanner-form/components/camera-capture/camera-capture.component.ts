import { Component, ViewChild, ElementRef, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePreviewComponent } from '../shared/image-preview/image-preview.component';
import { CameraService } from '../../../../../services/camera.service';

@Component({
  selector: 'app-camera-capture',
  standalone: true,
  imports: [CommonModule, ImagePreviewComponent],
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.scss'
})
export class CameraCaptureComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  @Output() imageCaptured = new EventEmitter<string>();
  @Output() analyzeRequested = new EventEmitter<void>();
  @Output() clearRequested = new EventEmitter<void>();

  private cameraService = inject(CameraService);

  isCameraActive = false;
  capturedImage: string | null = null;
  isLoading = false;

  ngOnDestroy() {
    this.cameraService.stopCamera(this.videoElement);
  }

  async startCamera() {
    try {
      await this.cameraService.startCamera(this.videoElement);
      this.isCameraActive = true;
    } catch (error) {
      console.error('Error al iniciar cámara:', error);
    }
  }

  stopCamera() {
    this.cameraService.stopCamera(this.videoElement);
    this.isCameraActive = false;
  }

  captureImage() {
    const imageData = this.cameraService.captureImage(this.videoElement, this.canvasElement);
    if (imageData) {
      this.capturedImage = imageData;
      this.imageCaptured.emit(imageData);
    }
  }

  onAnalyze() {
    this.analyzeRequested.emit();
  }

  onClear() {
    this.capturedImage = null;
    this.clearRequested.emit();
  }
}
