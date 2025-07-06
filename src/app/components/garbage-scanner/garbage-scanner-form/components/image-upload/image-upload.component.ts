import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadAreaComponent } from '../shared/upload-area/upload-area.component';
import { ImagePreviewComponent } from '../shared/image-preview/image-preview.component';
import { FileUtilsService } from '../../../../../services/file-utils.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, UploadAreaComponent, ImagePreviewComponent],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  @Output() imageSelected = new EventEmitter<{ file: File, preview: string }>();
  @Output() analyzeRequested = new EventEmitter<void>();
  @Output() clearRequested = new EventEmitter<void>();

  private fileUtils = inject(FileUtilsService);
  private alertService = inject(AlertService);

  selectedImage: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  async onFileSelected(file: File) {
    const validation = this.fileUtils.validateFile(file);
    if (validation.isValid) {
      this.selectedFile = file;
      try {
        this.selectedImage = await this.fileUtils.previewImage(file);
        if (this.selectedImage) {
          this.imageSelected.emit({ file, preview: this.selectedImage });
        }
      } catch {
        this.alertService.displayAlert('error', 'Error al previsualizar imagen');
      }
    } else {
      this.alertService.displayAlert('error', validation.error!);
    }
  }

  onAnalyze() {
    this.analyzeRequested.emit();
  }

  onClear() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.clearRequested.emit();
  }
}
