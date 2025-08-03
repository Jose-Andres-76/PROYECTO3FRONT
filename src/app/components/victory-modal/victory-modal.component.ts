import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-victory-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './victory-modal.component.html',
  styleUrl: './victory-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VictoryModalComponent {
  @Input() isVisible = false;
  @Input() totalObjects = 5;
  @Input() pointsEarned = 0;
  @Output() playAgain = new EventEmitter<void>();
  @Output() goToModule = new EventEmitter<void>();

  onPlayAgain = (): void => this.playAgain.emit();
  onGoToModule = (): void => this.goToModule.emit();
  onModalContentClick = (event: Event): void => event.stopPropagation();
}
