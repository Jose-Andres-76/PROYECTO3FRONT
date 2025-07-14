import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;

  async startCamera(videoElement: ElementRef<HTMLVideoElement>): Promise<MediaStream> {
    await this.waitForVideoElement(videoElement);
    this.stream = await this.requestCameraAccess();
    this.setupVideoStream(videoElement, this.stream);
    return this.stream;
  }

  stopCamera(videoElement?: ElementRef<HTMLVideoElement>) {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (videoElement?.nativeElement) {
      videoElement.nativeElement.srcObject = null;
    }
  }

  captureImage(videoElement: ElementRef<HTMLVideoElement>, canvasElement: ElementRef<HTMLCanvasElement>): string {
    const video = videoElement.nativeElement;
    const canvas = canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('No se pudo obtener contexto del canvas');
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  getCameraErrorMessage(error: any): string {
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError': return 'Permisos de cámara denegados.';
        case 'NotFoundError': return 'No se encontró cámara.';
        case 'NotReadableError': return 'Cámara en uso por otra aplicación.';
      }
    }
    return 'No se pudo acceder a la cámara.';
  }

  private async waitForVideoElement(videoElement: ElementRef<HTMLVideoElement>) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!videoElement?.nativeElement) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!videoElement?.nativeElement) {
        throw new Error('Video element not available');
      }
    }
  }

  private async requestCameraAccess(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment'
      } 
    });
  }

  private setupVideoStream(videoElement: ElementRef<HTMLVideoElement>, stream: MediaStream) {
    const video = videoElement.nativeElement;
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play().then(() => {
        console.log('Cámara activada');
      }).catch(err => {
        throw new Error('Error al reproducir video');
      });
    };
    video.onerror = () => {
      throw new Error('Error en elemento de video');
    };
  }
}
