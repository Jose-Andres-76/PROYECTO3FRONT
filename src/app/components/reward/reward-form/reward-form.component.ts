import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IReward, IFamily } from '../../../interfaces';
import { FamilyService } from '../../../services/family.service';
import { RewardService } from '../../../services/reward.service';

@Component({
  selector: 'app-reward-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './reward-form.component.html',
  styleUrl: './reward-form.component.scss'
})
export class RewardFormComponent implements OnInit {
  public fb: FormBuilder = inject(FormBuilder);
  public familyService: FamilyService = inject(FamilyService);
  public rewardService: RewardService = inject(RewardService);
  
  @Input() reward?: IReward;
  @Input() title: string = 'Add Reward';
  @Output() callSaveMethod: EventEmitter<IReward> = new EventEmitter<IReward>();
  @Output() callUpdateMethod: EventEmitter<IReward> = new EventEmitter<IReward>();

  public rewardForm!: FormGroup;

  ngOnInit() {
    console.log('RewardFormComponent initialized');
    this.familyService.getAll();
    this.initializeForm();
    
    setTimeout(() => {
      console.log('Available families in reward form:', this.familyService.families$());
    }, 1000);
  }

  private initializeForm(): void {
    this.rewardForm = this.fb.group({
      description: [
        this.reward?.description || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      cost: [
        this.reward?.cost || 0, 
        [Validators.required, Validators.min(1)]
      ],
      familyId: [
        this.reward?.familyId?.id || '', 
        [Validators.required]
      ],
      status: [
        this.reward?.status !== undefined ? this.reward.status : true
      ]
    });
  }

  public callSave(): void {
    if (this.rewardForm.valid) {
      const formValue = this.rewardForm.value;
      
      const rewardData: IReward = {
        description: formValue.description,
        cost: Number(formValue.cost),
        familyId: { id: Number(formValue.familyId) },
        status: formValue.status
      };

      if (this.reward?.id) {
        // Update existing reward
        rewardData.id = this.reward.id;
        this.callUpdateMethod.emit(rewardData);
        this.rewardService.update(rewardData);
      } else {
        // Create new reward
        this.callSaveMethod.emit(rewardData);
        this.rewardService.save(rewardData);
      }
    } else {
      this.rewardForm.markAllAsTouched();
    }
  }

  public getFamilyDisplayName(family: IFamily): string {
    if (family.father && family.son) {
      return `${family.father.name} ${family.father.lastname} - ${family.son.name} ${family.son.lastname}`;
    } else if (family.father) {
      return `${family.father.name} ${family.father.lastname} (Father)`;
    } else if (family.son) {
      return `${family.son.name} ${family.son.lastname} (Son)`;
    }
    return `Family ${family.id}`;
  }
}
