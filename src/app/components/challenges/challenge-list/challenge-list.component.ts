import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IChallenge } from '../../../interfaces';
import { ChallengeService } from '../../../services/challenge.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';

@Component({
  selector: 'app-challenge-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './challenge-list.component.html',
  styleUrls: ['./challenge-list.component.scss']
})
export class ChallengeListComponent {
  @Input() title: string = '';
  @Input() challenges: IChallenge[] = [];
  public challengeService: ChallengeService = inject(ChallengeService);
  public authService: AuthService = inject(AuthService);
  private confirmationModalService = inject(ConfirmationModalService);
  public user = this.authService.getUser();
  @Output() callModalAction: EventEmitter<IChallenge> = new EventEmitter<IChallenge>();
  @Output() callDeleteAction: EventEmitter<IChallenge> = new EventEmitter<IChallenge>();

  getSonName(challenge: IChallenge): string {
    const sonName = (challenge as any).family?.son?.name || 'N/A';
    
    console.log('Son name:', sonName);
    return sonName;
  }

  getSonLastname(challenge: IChallenge): string {
    const sonLastname = (challenge as any).family?.son?.lastname || 'N/A';
    
    
    console.log('Son lastname:', sonLastname);
    return sonLastname;
  }

  getGameType(challenge: IChallenge): string {
    const gameType = (challenge as any).game?.typesOfGames || 'N/A';
    
    console.log('Game type:', gameType);
    return gameType;
  }

  async confirmDelete(challenge: IChallenge): Promise<void> {
    const challengeDescription = challenge.description || 'este desafío';
    
    const confirmed = await this.confirmationModalService.confirmDelete(challengeDescription);
    
    if (confirmed) {
        this.callDeleteAction.emit(challenge);
    }
  }
}
