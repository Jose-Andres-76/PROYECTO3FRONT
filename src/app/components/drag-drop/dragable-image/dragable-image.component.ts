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
  @Output() dragStarted = new EventEmitter<any>();

  onDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(this.data));
    }
    this.dragStarted.emit(this.data);
  }
}