import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChallengeService } from '../../services/challenge.service';
import { IChallenge } from '../../interfaces';

@Component({
  selector: 'app-eco-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eco-challenges.component.html',
  styleUrls: ['./eco-challenges.component.scss'],
})
export class EcoChallengesComponent {
  private challengeService = inject(ChallengeService);
  getGameType(challenge: IChallenge): string {
  return (challenge as any).game?.typesOfGames || 'N/A';
}
  challenges = this.challengeService.challenges$;

  coins = computed(() =>
    this.challenges()
      .filter((c) => c.challengeStatus)
      .reduce((total, c) => total + (c.points || 0), 0)
  );

  constructor() {
    this.challengeService.getMyChallenges();
  }
}


