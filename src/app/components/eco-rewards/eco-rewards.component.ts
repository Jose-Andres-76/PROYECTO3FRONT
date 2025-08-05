import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RewardService } from '../../services/reward.service';
import { IReward } from '../../interfaces';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-eco-rewards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eco-rewards.component.html',
  styleUrls: ['./eco-rewards.component.scss'],
})
export class EcoRewardsComponent implements OnInit {
  private rewardService = inject(RewardService);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  
  rewards = this.rewardService.rewards$;
  coins = computed(() => this.profileService.user$()?.points || 0);

  ngOnInit(): void {
    // Refresh user data to get latest points
    this.profileService.getUserInfoSignal();
    this.rewardService.getAllActiveRewards();
  }

  claimReward(reward: IReward): void {
    this.rewardService.redeemRewards(reward);
    console.log(`Recompensa canjeada: ${reward.description}`);
    // Service handles the refresh automatically
  }
}