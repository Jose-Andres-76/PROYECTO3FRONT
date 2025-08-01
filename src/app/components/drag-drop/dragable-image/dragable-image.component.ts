import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-draggable-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dragable-image.component.html',
  styleUrl: './dragable-image.component.scss'
})
export class DraggableImageComponent {
  @Input() imageUrl: string = '';
  @Input() alt: string = '';
  @Input() data: any;
  @Input() draggable: boolean = true;
  @Output() dragStarted = new EventEmitter<any>();
  @Output() dragEnded = new EventEmitter<any>();

  onDragStart(event: DragEvent): void {
    if (!this.draggable) {
      event.preventDefault();
      return;
    }
    
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(this.data));
      event.dataTransfer.effectAllowed = 'move';
    }
    
    this.dragStarted.emit(this.data);
  }

  onDragEnd(event: DragEvent): void {
    this.dragEnded.emit(this.data);
  }
}