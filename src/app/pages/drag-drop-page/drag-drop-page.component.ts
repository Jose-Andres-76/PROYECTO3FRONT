import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableImageComponent } from '../../components/drag-drop/dragable-image/dragable-image.component';
import { DropZoneComponent } from '../../components/drag-drop/drop-zone/drop-zone.component';
import { DragDropService, GameImage } from '../../services/drag-drop.service';

@Component({
  selector: 'app-drag-drop-page',
  standalone: true,
  imports: [CommonModule, DraggableImageComponent, DropZoneComponent],
  templateUrl: './drag-drop-page.component.html',
  styleUrl: './drag-drop-page.component.scss'
})
export class DragDropPageComponent implements OnInit {
  private dragDropService = inject(DragDropService);

  draggableImages: GameImage[] = [];
  reciclableDropped: GameImage[] = [];
  noReciclableDropped: GameImage[] = [];
  errorCount = 0;
  errorMessage = '';
  gameOver = false;
  victoryMessage = '';

  ngOnInit() {
    this.shuffleImages();
  }

  shuffleImages() {
    this.draggableImages = this.dragDropService.getRandomImages(3);
    this.reciclableDropped = [];
    this.noReciclableDropped = [];
    this.errorCount = 0;
    this.errorMessage = '';
    this.gameOver = false;
    this.victoryMessage = '';
  }

  onDropReciclable(item: GameImage) {
    if (this.gameOver || this.victoryMessage) return;
    if (item.type === 'reciclable') {
      this.reciclableDropped.push(item);
      this.removeFromDraggable(item);
      this.errorMessage = '';
      this.checkVictory();
    } else {
      this.handleError();
    }
  }

  onDropNoReciclable(item: GameImage) {
    if (this.gameOver || this.victoryMessage) return;
    if (item.type === 'no-reciclable') {
      this.noReciclableDropped.push(item);
      this.removeFromDraggable(item);
      this.errorMessage = '';
      this.checkVictory();
    } else {
      this.handleError();
    }
  }

  removeFromDraggable(item: GameImage) {
    this.draggableImages = this.draggableImages.filter(img => img.name !== item.name);
  }

  handleError() {
    this.errorCount++;
    this.errorMessage = '¡Ups! Ese objeto no va en este contenedor.';
    if (this.errorCount > 2) {
      this.gameOver = true;
      this.errorMessage = '¡Game Over! Has cometido demasiados errores.';
    }
  }

  checkVictory() {
    if (this.draggableImages.length === 0) {
      this.victoryMessage = '¡Felicidades! Has clasificado todos los objetos correctamente.';
    }
  }
}