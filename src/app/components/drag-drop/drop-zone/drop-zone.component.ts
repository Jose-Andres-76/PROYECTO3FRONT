import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drop-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-zone.component.html',
  styleUrl: './drop-zone.component.scss'
})
export class DropZoneComponent implements AfterViewInit {
  @Input() label: string = '';
  @Input() color: string = '#666';
  @Input() acceptType: string = '';
  @Output() itemDropped = new EventEmitter<any>();

  @ViewChild('dropZoneContent', { static: false }) dropZoneContent?: ElementRef;

  isOver: boolean = false;
  hasItems: boolean = false;

  ngAfterViewInit(): void {
    this.checkForItems();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    this.isOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    // Solo cambiar isOver si realmente salimos del drop zone
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.isOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isOver = false;
    
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      try {
        const droppedItem = JSON.parse(data);
        this.itemDropped.emit(droppedItem);
        // Actualizar hasItems después de un pequeño delay para permitir que el DOM se actualice
        setTimeout(() => this.checkForItems(), 100);
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    }
  }

  private checkForItems(): void {
    // Verificar si hay elementos dentro del ng-content
    if (this.dropZoneContent) {
      const contentElements = this.dropZoneContent.nativeElement.children;
      this.hasItems = contentElements.length > 0;
    }
  }
}