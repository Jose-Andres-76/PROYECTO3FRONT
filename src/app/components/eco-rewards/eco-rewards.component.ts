import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RewardService } from '../../services/reward.service';
import { IReward } from '../../interfaces';

@Component({
  selector: 'app-eco-rewards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eco-rewards.component.html',
  styleUrls: ['./eco-rewards.component.scss'],
})
export class EcoRewardsComponent implements OnInit {
  private rewardService = inject(RewardService);

  rewards = this.rewardService.rewards$;

  coins = computed(() =>
    this.rewards().reduce((total, r) => total + (r.cost || 0), 0)
  );

  // constructor() {
  //   this.rewardService.getAllActiveRewards();
  // }
  ngOnInit(): void {
    this.rewardService.getAllActiveRewards();
  }
  claimReward(reward: IReward) {

    this.rewardService.redeemRewards(reward)
  console.log(`Recompensa seleccionada: ${reward.description}`);
  this.ngOnInit();
}

}
