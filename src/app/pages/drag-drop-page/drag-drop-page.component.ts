import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, transition, animate } from '@angular/animations';
import { DraggableImageComponent } from '../../components/drag-drop/dragable-image/dragable-image.component';
import { DropZoneComponent } from '../../components/drag-drop/drop-zone/drop-zone.component';
import { GameOverModalComponent } from '../../components/game-over-modal/game-over-modal.component';
import { VictoryModalComponent } from '../../components/victory-modal/victory-modal.component';
import { DragDropService, GameImage } from '../../services/drag-drop.service';
import { GameIntegrationService, GameResult } from '../../services/game-integration.service';

const GAME_CONFIG = { MAX_ERRORS: 3, IMAGES_COUNT: 5, ERROR_DISPLAY_DURATION: 3000 } as const;

enum GameState { PLAYING = 'playing', VICTORY = 'victory', GAME_OVER = 'game_over' }
enum MessageType { ERROR = 'error', SUCCESS = 'success', CHALLENGE = 'challenge' }

@Component({
  selector: 'app-drag-drop-page',
  standalone: true,
  imports: [CommonModule, DraggableImageComponent, DropZoneComponent, GameOverModalComponent, VictoryModalComponent],
  templateUrl: './drag-drop-page.component.html',
  styleUrl: './drag-drop-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class DragDropPageComponent implements OnInit {
  private readonly dragDropService = inject(DragDropService);
  private readonly router = inject(Router);
  private readonly gameIntegrationService = inject(GameIntegrationService);

  protected readonly draggableImages = signal<GameImage[]>([]);
  protected readonly reciclableDropped = signal<GameImage[]>([]);
  protected readonly noReciclableDropped = signal<GameImage[]>([]);
  protected readonly errorCount = signal<number>(0);
  protected readonly gameState = signal<GameState>(GameState.PLAYING);
  protected readonly currentMessage = signal<{ text: string; type: MessageType } | null>(null);
  protected readonly pointsEarned = signal<number>(0);

  protected readonly isGameActive = computed(() => this.gameState() === GameState.PLAYING);
  protected readonly totalDropped = computed(() => this.reciclableDropped().length + this.noReciclableDropped().length);
  protected readonly progress = computed(() => this.totalDropped() / GAME_CONFIG.IMAGES_COUNT * 100);
  protected readonly hasMessage = computed(() => this.currentMessage() !== null);
  protected readonly messageText = computed(() => this.currentMessage()?.text || '');
  protected readonly messageClass = computed(() => {
    const message = this.currentMessage();
    return message ? `notification notification--${message.type}` : '';
  });
  protected readonly messageIcon = computed(() => {
    const message = this.currentMessage();
    if (!message) return '';
    switch (message.type) {
      case MessageType.SUCCESS: return 'fas fa-check-circle';
      case MessageType.ERROR: return 'fas fa-exclamation-triangle';
      case MessageType.CHALLENGE: return 'fas fa-trophy';
      default: return 'fas fa-bell';
    }
  });
  protected readonly isGameOver = computed(() => this.gameState() === GameState.GAME_OVER);
  protected readonly hasWon = computed(() => this.gameState() === GameState.VICTORY);

  private messageTimeout?: number;

  ngOnInit(): void {
    this.initializeGame();
    this.gameIntegrationService.checkActiveChallenges().subscribe({
      next: (challenges: any[]) => {
        if (challenges.length > 0) {
          const challenge = challenges[0];
          this.showMessage(
            `Challenge activo: ${challenge.description} (+${challenge.points} puntos)`,
            MessageType.CHALLENGE
          );
        }
      },
      error: () => {} // Silently handle error
    });
  }

  protected initializeGame(): void {
    if (this.messageTimeout) {
      window.clearTimeout(this.messageTimeout);
      this.messageTimeout = undefined;
    }
    this.draggableImages.set(this.dragDropService.getRandomImages(GAME_CONFIG.IMAGES_COUNT));
    this.reciclableDropped.set([]);
    this.noReciclableDropped.set([]);
    this.errorCount.set(0);
    this.gameState.set(GameState.PLAYING);
    this.currentMessage.set(null);
    this.pointsEarned.set(0);
  }

  protected onDropReciclable(item: GameImage): void {
    this.handleDrop(item, 'reciclable', this.reciclableDropped, 'Excelente! Clasificación correcta');
  }

  protected onDropNoReciclable(item: GameImage): void {
    this.handleDrop(item, 'no-reciclable', this.noReciclableDropped, 'Muy bien! Clasificación correcta');
  }

  private handleDrop(item: GameImage, expectedType: string, targetZone: ReturnType<typeof signal<GameImage[]>>, successMessage: string): void {
    if (!this.isGameActive()) return;
    
    if (item.type === expectedType) {
      targetZone.update(items => [...items, item]);
      this.draggableImages.update(items => items.filter(img => img.name !== item.name));
      this.checkVictory();
      this.showMessage(successMessage, MessageType.SUCCESS);
    } else {
      this.handleIncorrectDrop();
    }
  }

  private handleIncorrectDrop(): void {
    const newErrorCount = this.errorCount() + 1;
    this.errorCount.set(newErrorCount);
    
    if (newErrorCount >= GAME_CONFIG.MAX_ERRORS) {
      this.gameState.set(GameState.GAME_OVER);
      this.showMessage('Game Over! Has cometido demasiados errores. Inténtalo de nuevo!', MessageType.ERROR);
    } else {
      const remainingErrors = GAME_CONFIG.MAX_ERRORS - newErrorCount;
      this.showMessage(
        `¡Ups! Ese objeto no va en este contenedor. Te quedan ${remainingErrors} ${remainingErrors === 1 ? 'intento' : 'intentos'}.`,
        MessageType.ERROR
      );
    }
  }

  private checkVictory(): void {
    if (this.draggableImages().length === 0) {
      this.gameState.set(GameState.VICTORY);
      
      const gameResult: GameResult = {
        success: true,
        totalCorrect: this.reciclableDropped().length + this.noReciclableDropped().length,
        totalErrors: this.errorCount(),
        pointsEarned: 0
      };

      this.gameIntegrationService.processGameResult(gameResult).subscribe({
        next: (result: any) => {
          if (result?.success) {
            this.pointsEarned.set(result.pointsEarned || 0);
            
            if (result.pointsEarned > 0) {
              this.showMessage(
                result.challengeCompleted 
                  ? `Desafío completado! Has ganado ${result.pointsEarned} puntos`
                  : `Excelente! Has ganado ${result.pointsEarned} puntos`,
                MessageType.SUCCESS
              );
            } else {
              this.showMessage('Clasificación perfecta! Para ganar puntos, acepta un desafío primero.', MessageType.SUCCESS);
            }
          } else {
            this.pointsEarned.set(0);
            this.showMessage('Clasificación completada! Eres un experto en reciclaje!', MessageType.SUCCESS);
          }
        },
        error: (error: any) => {
          this.pointsEarned.set(0);
          this.showMessage('Clasificación completada!', MessageType.SUCCESS);
        }
      });
    }
  }

  private showMessage(text: string, type: MessageType): void {
    if (this.messageTimeout) {
      window.clearTimeout(this.messageTimeout);
      this.messageTimeout = undefined;
    }
    this.currentMessage.set({ text, type });
    
    if (this.gameState() === GameState.PLAYING) {
      this.messageTimeout = window.setTimeout(() => {
        this.currentMessage.set(null);
      }, GAME_CONFIG.ERROR_DISPLAY_DURATION);
    }
  }

  protected trackByImageName = (index: number, item: GameImage): string => item.name;

  protected onPlayAgain(): void {
    this.gameState.set(GameState.PLAYING);
    this.currentMessage.set(null);
    this.initializeGame();
  }

  protected onGoToModule(): void {
    this.router.navigate(['/app/Eco']);
  }
}