import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IReward } from '../../../interfaces';
import { RewardService } from '../../../services/reward.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reward-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.scss'],
})
export class RewardListComponent {
  @Input() title: string = '';
  @Input() rewards: IReward[] = [];
  public rewardService: RewardService = inject(RewardService);
  public authService: AuthService = inject(AuthService);
  public user = this.authService.getUser();
  @Output() callModalAction: EventEmitter<IReward> = new EventEmitter<IReward>();
  @Output() callDeleteAction: EventEmitter<IReward> = new EventEmitter<IReward>();

  getSonName(reward: IReward): string {
    const sonName = (reward as any).family?.son?.name || 'N/A';
    
    console.log('Son name:', sonName);
    return sonName;
  }

  getSonLastname(reward: IReward): string {
    const sonLastname = (reward as any).family?.son?.lastname || 'N/A';
    
    
    console.log('Son lastname:', sonLastname);
    return sonLastname;
  }
}
