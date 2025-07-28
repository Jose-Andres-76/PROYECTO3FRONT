import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IChallenge, IFamily, IGame } from '../../../interfaces';
import { FamilyService } from '../../../services/family.service';
import { GameService } from '../../../services/game.service';
import { ChallengeService } from '../../../services/challenge.service';

@Component({
  selector: 'app-challenge-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './challenge-form.component.html',
  styleUrl: './challenge-form.component.scss'
})
export class ChallengeFormComponent implements OnInit {
  public fb: FormBuilder = inject(FormBuilder);
  public familyService: FamilyService = inject(FamilyService);
  public gameService: GameService = inject(GameService);
  public challengeService: ChallengeService = inject(ChallengeService);
  
  @Input() challenge?: IChallenge;
  @Input() title: string = 'Agregar Reto';
  @Output() callSaveMethod: EventEmitter<IChallenge> = new EventEmitter<IChallenge>();
  @Output() callUpdateMethod: EventEmitter<IChallenge> = new EventEmitter<IChallenge>();
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();

  public challengeForm!: FormGroup;

  ngOnInit() {
    console.log('ChallengeFormComponent initialized');
    this.familyService.getMyFamilies();
    this.gameService.getAll();
    this.initializeForm();
    
    setTimeout(() => {
      console.log('Available families in challenge form:', this.familyService.families$());
      console.log('Available games in challenge form:', this.gameService.items$());
    }, 1000);
  }

  private initializeForm(): void {
    this.challengeForm = this.fb.group({
      id: [this.challenge?.id || ''],
      description: [
        this.challenge?.description || '', 
        [Validators.required, Validators.minLength(3)]
      ],
      points: [
        this.challenge?.points || 0, 
        [Validators.required, Validators.min(1)]
      ],
      familyId: [
        this.challenge?.family?.id || '', 
        [Validators.required]
      ],
      gameId: [
        this.challenge?.game?.id || ''
      ],
      challengeStatus: [
        this.challenge?.challengeStatus !== undefined ? this.challenge.challengeStatus : true
      ]
    });
  }

  public callSave(): void {
    let item: IChallenge = {
      description: this.challengeForm.controls['description'].value,
      points: this.challengeForm.controls['points'].value,
      family: {  
        id: this.challengeForm.controls['familyId'].value  
      },
      // game: {
      //   id: this.challengeForm.controls['gameId'].value
      // },
      challengeStatus: this.challengeForm.controls['challengeStatus'].value
    };

    const gameId = this.challengeForm.controls['gameId'].value;
    if (gameId) {
      item.game = {
        id: gameId
      };
    }
    
    if (this.challengeForm.controls['id'].value) {
      item.id = this.challengeForm.controls['id'].value;
    }
    
    console.log('Sending challenge object:', item);
    
    if (item.id) {
      this.callUpdateMethod.emit(item);
    } else {
      this.callSaveMethod.emit(item);
    }
  }

  public cancelAction(): void {
    this.callCancelMethod.emit();
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

  public getGameDisplayName(game: IGame): string {
    if (game.typesOfGames) {
      return `${game.typesOfGames}`;
    }
    if (game.typesOfGames) return game.typesOfGames;
    return `Game ${game.id}`;
  }
}
