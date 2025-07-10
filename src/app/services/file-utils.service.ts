import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUtilsService {
  private readonly validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private readonly maxSize = 10 * 1024 * 1024; // 10MB

  validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.validTypes.includes(file.type)) {
      return { isValid: false, error: 'Formato de archivo no válido. Use JPG, PNG o WebP.' };
    }
    if (file.size > this.maxSize) {
      return { isValid: false, error: 'El archivo es muy grande. Máximo 10MB.' };
    }
    return { isValid: true };
  }

  previewImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(file);
    });
  }

  dataURLtoBlob(dataURL: string): Blob {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  createFileFromDataURL(dataURL: string, filename: string = 'captured-image.jpg'): File {
    const blob = this.dataURLtoBlob(dataURL);
    return new File([blob], filename, { type: 'image/jpeg' });
  }
}
