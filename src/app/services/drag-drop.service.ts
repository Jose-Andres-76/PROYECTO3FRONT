import { Injectable } from '@angular/core';

export interface GameImage {
  imageUrl: string;
  alt: string;
  type: 'reciclable' | 'no-reciclable';
  name: string;
  category?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  private readonly images: GameImage[] = [
    {
      imageUrl: 'assets/img/games/drag-drop/botellavidrio.png',
      alt: 'Botella de vidrio',
      type: 'reciclable',
      name: 'Botella',
      category: 'vidrio',
      description: 'Las botellas de vidrio se pueden reciclar infinitas veces'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/coca-cola-bebida-fría.webp',
      alt: 'Lata de Coca-Cola',
      type: 'reciclable',
      name: 'Lata',
      category: 'metal',
      description: 'Las latas de aluminio son 100% reciclables'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/papel.png',
      alt: 'Papel',
      type: 'reciclable',
      name: 'Papel',
      category: 'papel',
      description: 'El papel se puede reciclar hasta 7 veces'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/botella-plastico.webp',
      alt: 'Botella de plástico',
      type: 'reciclable',
      name: 'Botella',
      category: 'plastico',
      description: 'Las botellas PET se pueden convertir en nuevos productos'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/periodico.webp',
      alt: 'Periódico',
      type: 'reciclable',
      name: 'Periódico',
      category: 'papel',
      description: 'Los periódicos son perfectos para el reciclaje de papel'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/carton.webp',
      alt: 'Cartón',
      type: 'reciclable',
      name: 'Cartón',
      category: 'papel',
      description: 'El cartón es uno de los materiales más reciclados'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/manzanamordida.webp',
      alt: 'Manzana mordida',
      type: 'no-reciclable',
      name: 'Manzana',
      category: 'organico',
      description: 'Los restos de comida van a residuos orgánicos'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/cascara-banana.webp',
      alt: 'Cáscara de banana',
      type: 'no-reciclable',
      name: 'Banana',
      category: 'organico',
      description: 'Las cáscaras van a compost o residuos orgánicos'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/chicle.webp',
      alt: 'Chicle',
      type: 'no-reciclable',
      name: 'Chicle',
      category: 'residuo',
      description: 'El chicle no es reciclable y contamina el medio ambiente'
    },
    {
      imageUrl: 'assets/img/games/drag-drop/colilla-cigarro.webp',
      alt: 'Cigarrillo',
      type: 'no-reciclable',
      name: 'Cigarrillo',
      category: 'toxico',
      description: 'Las colillas son residuos tóxicos que contaminan'
    }
  ];

  getRandomImages(count: number, ensureBalance: boolean = true): GameImage[] {
    if (ensureBalance) {
      return this.getBalancedRandomImages(count);
    }
    
    return [...this.images]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, this.images.length));
  }

  private getBalancedRandomImages(count: number): GameImage[] {
    const reciclables = this.images.filter(img => img.type === 'reciclable');
    const noReciclables = this.images.filter(img => img.type === 'no-reciclable');
    
    const halfCount = Math.floor(count / 2);
    const reciclablesCount = halfCount;
    const noReciclablesCount = count - halfCount;
    
    const selectedReciclables = this.shuffleArray([...reciclables])
      .slice(0, Math.min(reciclablesCount, reciclables.length));
      
    const selectedNoReciclables = this.shuffleArray([...noReciclables])
      .slice(0, Math.min(noReciclablesCount, noReciclables.length));
    
    return this.shuffleArray([...selectedReciclables, ...selectedNoReciclables]);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getAllImages(): GameImage[] {
    return [...this.images];
  }

  getImagesByType(type: 'reciclable' | 'no-reciclable'): GameImage[] {
    return this.images.filter(img => img.type === type);
  }

  getImagesByCategory(category: string): GameImage[] {
    return this.images.filter(img => img.category === category);
  }

  getImageStats(): { total: number; reciclables: number; noReciclables: number; categorias: string[] } {
    const reciclables = this.getImagesByType('reciclable').length;
    const noReciclables = this.getImagesByType('no-reciclable').length;
    const categorias = [...new Set(this.images.map(img => img.category).filter((cat): cat is string => Boolean(cat)))];
    
    return {
      total: this.images.length,
      reciclables,
      noReciclables,
      categorias
    };
  }
}