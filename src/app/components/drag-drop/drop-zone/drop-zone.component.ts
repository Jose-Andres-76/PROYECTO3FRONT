import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.scss'
})
export class DropZoneComponent {
  @Input() label: string = '';
  @Input() color: string = 'white';
  @Input() acceptType: string = '';
  @Output() itemDropped = new EventEmitter<any>();

  isOver: boolean = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isOver = false;
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      this.itemDropped.emit(JSON.parse(data));
    }
  }
}