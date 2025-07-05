import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analyzed-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyzed-result.component.html',
  styleUrl: './analyzed-result.component.scss'
})
export class AnalyzedResultComponent {
  @Input() imageSrc: string | null = null;
  @Output() scanNewRequested = new EventEmitter<void>();

  scanNew() {
    this.scanNewRequested.emit();
  }
}
