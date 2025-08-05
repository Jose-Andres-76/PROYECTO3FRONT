import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChallengeService } from '../../services/challenge.service';
import { IChallenge } from '../../interfaces';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-eco-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eco-challenges.component.html',
  styleUrls: ['./eco-challenges.component.scss'],
})
export class EcoChallengesComponent implements OnInit{
  private challengeService = inject(ChallengeService);
  private profileService = inject(ProfileService);
  getGameType(challenge: IChallenge): string {
  return (challenge as any).game?.typesOfGames || 'N/A';
}

coins = computed(() => this.profileService.user$()?.points || 0);
challenges = this.challengeService.challenges$;



  ngOnInit(): void {
    this.profileService.getUserInfoSignal();
    this.challengeService.getAllActiveChallenges();
  }
  constructor() {
  }
}


