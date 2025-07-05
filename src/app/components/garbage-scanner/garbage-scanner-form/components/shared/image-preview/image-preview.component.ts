import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-preview.component.html',
  styleUrl: './image-preview.component.scss'
})
export class ImagePreviewComponent {
  @Input() imageSrc: string | null = null;
  @Input() title: string = 'Vista Previa';
  @Input() analyzeButtonText: string = 'Analizar Imagen';
  @Input() clearIcon: string = 'fa-times';
  @Input() isLoading: boolean = false;
  @Output() analyzeRequested = new EventEmitter<void>();
  @Output() clearRequested = new EventEmitter<void>();

  analyze() {
    this.analyzeRequested.emit();
  }

  clear() {
    this.clearRequested.emit();
  }
}
