import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-over-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-over-modal.component.html',
  styleUrl: './game-over-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameOverModalComponent {
  @Input() isVisible = false;
  @Input() errorCount = 0;
  @Input() maxErrors = 3;
  @Output() playAgain = new EventEmitter<void>();
  @Output() goToModule = new EventEmitter<void>();

  onPlayAgain = (): void => this.playAgain.emit();
  onGoToModule = (): void => this.goToModule.emit();
  onBackdropClick = (event: Event): void => {
    if (event.target === event.currentTarget) {
      // No hace nada al hacer click en el backdrop
    }
  };
  onModalContentClick = (event: Event): void => event.stopPropagation();
}
