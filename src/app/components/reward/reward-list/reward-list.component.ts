import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IReward } from '../../../interfaces';
import { RewardService } from '../../../services/reward.service';
import { AuthService } from '../../../services/auth.service';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';
import { PaginationComponent } from '../../pagination/pagination.component';

@Component({
  selector: 'app-reward-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.scss'],
})
export class RewardListComponent {
  @Input() title: string = '';
  @Input() rewards: IReward[] = [];
  @Input() showPagination: boolean = true;
  @Input() paginationMethod: 'getMyRewards' | 'getAllActiveRewards' = 'getMyRewards';
  
  public rewardService: RewardService = inject(RewardService);
  public authService: AuthService = inject(AuthService);
  private confirmationModalService = inject(ConfirmationModalService);
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

  async confirmDelete(reward: IReward): Promise<void> {
    const rewardDescription = reward.description || 'esta recompensa';
    
    const confirmed = await this.confirmationModalService.confirmDelete(rewardDescription);
    
    if (confirmed) {
        this.callDeleteAction.emit(reward);
    }
  }

  onCustomPagination(): void {
    switch (this.paginationMethod) {
      case 'getMyRewards':
        this.rewardService.getMyRewards();
        break;
      case 'getAllActiveRewards':
        this.rewardService.getAllActiveRewards();
        break;
      default:
        this.rewardService.getMyRewards();
        break;
    }
  }
}
