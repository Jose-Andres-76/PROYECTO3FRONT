import { Injectable } from '@angular/core';

export interface GameImage {
  imageUrl: string;
  alt: string;
  type: 'reciclable' | 'no-reciclable';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private images: GameImage[] = [
    {
      imageUrl: 'assets/img/games/drag-drop/basura.webp',
      alt: 'Basura',
      type: 'no-reciclable',
      name: 'Basura'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/botellavidrio.png',
      alt: 'Botella de vidrio',
      type: 'reciclable',
      name: 'Botella de vidrio'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/coca-cola-bebida-fría.webp',
      alt: 'Lata de Coca-Cola',
      type: 'reciclable',
      name: 'Lata de Coca-Cola'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/manzanamordida.webp',
      alt: 'Manzana mordida',
      type: 'no-reciclable',
      name: 'Manzana mordida'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/papel.png',
      alt: 'Papel',
      type: 'reciclable',
      name: 'Papel'
    }
  ];

  getRandomImages(count: number): GameImage[] {
    return [...this.images]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  getAllImages(): GameImage[] {
    return [...this.images];
  }
}