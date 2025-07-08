import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-area.component.html',
  styleUrl: './upload-area.component.scss'
})
export class UploadAreaComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() fileSelected = new EventEmitter<File>();
  
  isDragOver = false;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileSelected.emit(files[0]);
    }
  }
}
