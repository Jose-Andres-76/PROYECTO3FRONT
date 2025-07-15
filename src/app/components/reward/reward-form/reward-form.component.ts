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
      id: [this.reward?.id || ''],
      description: [
        this.reward?.description || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      cost: [
        this.reward?.cost || 0, 
        [Validators.required, Validators.min(1)]
      ],
      familyId: [
        this.reward?.family?.id || '', 
        [Validators.required]
      ],
      status: [
        this.reward?.status !== undefined ? this.reward.status : true
      ]
    });
  }

  public callSave(): void {
    let item: IReward = {
      description: this.rewardForm.controls['description'].value,
      cost: this.rewardForm.controls['cost'].value,
      family: {  // Change from 'familyId' to 'family'
        id: this.rewardForm.controls['familyId'].value  // Keep as object with id property
      },
      status: this.rewardForm.controls['status'].value
    };
    if (this.rewardForm.controls['id'].value) {
      item.id = this.rewardForm.controls['id'].value;
    }
    if (item.id) {
      this.callUpdateMethod.emit(item);
    } else {
      this.callSaveMethod.emit(item);
    }
  }

  public getFamilyDisplayName(family: IFamily): string {
    const getPersonName = (person: any) => person ? `${person.name} ${person.lastname}` : '';
  
    const fatherName = getPersonName(family.father);
    const sonName = getPersonName(family.son);

    if (fatherName && sonName) return `${fatherName} - ${sonName}`;
    if (fatherName) return `${fatherName} (Father)`;
    if (sonName) return `${sonName} (Son)`;

    return `Family ${family.id}`;
  }
}
