import { Component, ViewChild } from "@angular/core";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { FamilyListComponent } from "../../components/families/family-list/family-list.component";
import { RewardListComponent } from "../../components/reward/reward-list/reward-list.component";
import { RewardFormComponent } from "../../components/reward/reward-form/reward-form.component";
import { ChallengeListComponent } from "../../components/challenges/challenge-list/challenge-list.component";
import { ChallengeFormComponent } from "../../components/challenges/challenge-form/challenge-form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { FamilyService } from "../../services/family.service";
import { RewardService } from "../../services/reward.service";
import { ChallengeService } from "../../services/challenge.service";
import { inject } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { IFamily, IUser, IReward, IChallenge } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { FamilyMemberFormComponent } from "../../components/families/family-member-form/family-member-form.component";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-family',
    standalone: true,
    imports: [
        FamilyListComponent,
        RewardListComponent,
        RewardFormComponent,
        ChallengeListComponent,
        ChallengeFormComponent,
        PaginationComponent,
        ModalComponent,
        LoaderComponent,
        FamilyMemberFormComponent
    ],
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.scss'
})
export class ListingComponent {
  public familyService = inject(FamilyService);
  public rewardService = inject(RewardService);
  public challengeService = inject(ChallengeService);
  public authService = inject(AuthService);
  public modalService = inject(ModalService);
  public userService = inject(UserService);
  
  @ViewChild('addFamilyModal') public addFamilyModal: any;
  @ViewChild('editFamilyMemberModal') public editFamilyMemberModal: any;
  @ViewChild('addRewardModal') public addRewardModal: any;
  @ViewChild('editRewardModal') public editRewardModal: any;
  @ViewChild('addChallengeModal') public addChallengeModal: any;
  @ViewChild('editChallengeModal') public editChallengeModal: any;
  public fb: FormBuilder = inject(FormBuilder); 

  public user = this.authService.getUser();
  public isCreatingFamily = false;
  public newSonUser: IUser | null = null;
  public selectedReward: IReward | null = null;
  public selectedChallenge: IChallenge | null = null;

  familyForm = this.fb.group({
    id: [''],
    idSon: [''],
    idFather: [''],
  });

  memberForm = this.fb.group({
    id: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: ['', [Validators.required, Validators.min(10), Validators.max(120)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    points: [0, [Validators.min(0), Validators.pattern(/^\d+$/)]]
});

  rewardForm = this.fb.group({
    id: [''],
    description: ['', [Validators.required, Validators.minLength(3)]],
    cost: ['', [Validators.required, Validators.min(1)]],
    familyId: ['', Validators.required],
    status: [true]
  });

  challengeForm = this.fb.group({
    id: [''],
    description: ['', [Validators.required, Validators.minLength(3)]],
    points: ['', [Validators.required, Validators.min(1)]],
    familyId: ['', Validators.required],
    gameId: ['', Validators.required],
    challengeStatus: [true]
  });

  private currentMemberRole: any = null;

    constructor() {
        this.familyService.search.page = 1;
        this.familyService.getMyFamilies();
        
        this.rewardService.search.page = 1;
        this.rewardService.getMyRewards();

        this.challengeService.search.page = 1;
        this.challengeService.getMyChallenges();
    }

    openAddFamilyModal() {
    this.isCreatingFamily = false;
    
    this.memberForm.reset();
    
    this.memberForm.controls['age']?.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
    this.memberForm.controls['age']?.updateValueAndValidity();
    
    this.memberForm.controls['id']?.clearValidators();
    this.memberForm.controls['id']?.updateValueAndValidity();
    
    this.memberForm.patchValue({
        id: '',
        name: '',
        lastname: '',
        email: '',
        age: '',
        password: '',
        points: 0
    });
    
    this.memberForm.markAsPristine();
    this.memberForm.markAsUntouched();
    
    this.modalService.displayModal('lg', this.addFamilyModal);
}

    onSonUserCreated(userData: IUser) {
        console.log('User created successfully:', userData);
        console.log('User ID for family creation:', userData.id);
        
        if (!userData.id) {
            console.error('No user ID provided for family creation');
            return;
        }
        
        this.newSonUser = userData;
        
        setTimeout(() => {
            this.createFamily();
        }, 1000);
    }

    createFamily() {
        if (!this.newSonUser || !this.user) {
            console.error('Missing required data for family creation');
            console.log('newSonUser:', this.newSonUser);
            console.log('current user:', this.user);
            return;
        }

        if (!this.newSonUser.id) {
            console.error('Son user does not have an ID');
            return;
        }

        if (!this.user.id) {
            console.error('Current user does not have an ID');
            return;
        }

        const newFamily = {
            father: {
                id: this.user.id
            },
            son: {
                id: this.newSonUser.id
            }
        };

        console.log('Creating family with father ID:', this.user.id);
        console.log('Creating family with son ID:', this.newSonUser.id);
        console.log('Creating family with family object:', newFamily);
        this.familyService.save(newFamily);
    }

    closeAddFamilyModal() {
        this.isCreatingFamily = false;
        this.newSonUser = null;
        this.modalService.closeAll();
    }

    saveFamily(family: IFamily) {
        if (this.user?.id) {
            const familyToSave = {
                father: {
                    id: this.user.id
                },
                son: family.idSon
            };
            this.familyService.save(familyToSave);
        }
    }

    updateFamily(family: IFamily) {
        this.familyService.update(family);
    }

    deleteFamily(family: IFamily) {
        this.familyService.delete(family);
    }

    callEdition(family: IFamily) {
        console.log('Editing family member:', family); 
        if (family.son) {
            this.isCreatingFamily = false;
            
            this.currentMemberRole = family.son.role || {
                id: 2,
                name: 'ROLE_SON',
                description: 'Son Role'
            };

            this.memberForm.reset();
            
            this.memberForm.controls['age']?.clearValidators();
            this.memberForm.controls['age']?.updateValueAndValidity();
            
            this.memberForm.controls['id']?.setValidators([Validators.required]);
            this.memberForm.controls['id']?.updateValueAndValidity();

            this.memberForm.patchValue({
                id: family.son.id !== undefined && family.son.id !== null ? String(family.son.id) : '',
                name: family.son.name || '',
                lastname: family.son.lastname || '',
                email: family.son.email || '',
                age: '',
                password: '',
                points: family.son.points || 0
            });
            
            this.memberForm.markAsPristine();
            this.memberForm.markAsUntouched();
            
            console.log('Form values set:', this.memberForm.value); 
            console.log('Son role:', family.son.role); 
            this.modalService.displayModal('lg', this.editFamilyMemberModal);
        } else {
            console.error('No son data found in family:', family);
        }
    }

    openAddFamilyMemberModal() {
        this.memberForm.reset();
        this.memberForm.controls['age']?.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
        this.memberForm.controls['age']?.updateValueAndValidity();
        
        this.memberForm.patchValue({
            points: 0
        });
        
        this.modalService.displayModal('lg', this.editFamilyMemberModal);
    }

    updateFamilyMember(member: IUser) {
        const memberWithRole = {
          ...member,
          role: this.currentMemberRole
        };
        
        console.log('Updating family member with role:', memberWithRole);
        this.userService.updateFamilyMember(memberWithRole);
        this.modalService.closeAll();
        setTimeout(() => {
            this.familyService.getMyFamilies();
        }, 500);
    }

    openAddRewardModal() {
        this.selectedReward = null;
        this.modalService.displayModal('lg', this.addRewardModal);
    }

    callRewardEdition(reward: IReward) {
        console.log('Editing reward:', reward);
        this.selectedReward = reward;
        this.modalService.displayModal('lg', this.editRewardModal);
    }

    getSelectedReward(): IReward | undefined {
        return this.selectedReward || undefined;
    }

    saveReward(reward: IReward) {
        console.log('=== LISTING COMPONENT SAVE REWARD ===');
        console.log('Received reward object:', reward);
        
        if (!reward.family || !reward.family.id) {  
            console.error('Reward must have a valid family with id');
            return;
        }
        
        this.rewardService.save(reward);
        this.modalService.closeAll();
    }

    updateReward(reward: IReward) {
        console.log('Updating reward:', reward);
        this.rewardService.update(reward);
        this.modalService.closeAll();
    }

    deleteReward(reward: IReward) {
        console.log('Deleting reward:', reward);
        this.rewardService.delete(reward);
    }

    openAddChallengeModal() {
        this.selectedChallenge = null;
        this.modalService.displayModal('lg', this.addChallengeModal);
    }

    callChallengeEdition(challenge: IChallenge) {
        console.log('Editing challenge:', challenge);
        this.selectedChallenge = challenge;
        this.modalService.displayModal('lg', this.editChallengeModal);
    }

    getSelectedChallenge(): IChallenge | undefined {
        return this.selectedChallenge || undefined;
    }

    saveChallenge(challenge: IChallenge) {
        console.log('=== LISTING COMPONENT SAVE CHALLENGE ===');
        console.log('Received challenge object:', challenge);
        
        if (!challenge.family || !challenge.family.id) {  
            console.error('Challenge must have a valid family with id');
            return;
        }
        
        this.challengeService.save(challenge);
        this.modalService.closeAll();
    }

    updateChallenge(challenge: IChallenge) {
        console.log('Updating challenge:', challenge);
        this.challengeService.update(challenge);
        this.modalService.closeAll();
    }

    deleteChallenge(challenge: IChallenge) {
        console.log('Deleting challenge:', challenge);
        this.challengeService.delete(challenge);
    }

@ViewChild('familyMemberFormComponent') familyMemberFormComponent: any;

saveFamilyMember(member: IUser) {
    console.log('Family member created, now creating family relationship:', member);
    
    if (member.id && this.user?.id) {
        const newFamily = {
            father: { id: this.user.id },
            son: { id: member.id }
        };
        
        console.log('Creating family relationship:', newFamily);
        this.familyService.save(newFamily);
        this.closeAddFamilyModal();
        
        setTimeout(() => {
            this.familyService.getMyFamilies();
        }, 500);
    } else {
        console.error('No user ID found for family creation:', member);
        this.showErrorMessage('Usuerio fue creado, pero no se pudo crear la familia. Por favor, inténtalo de nuevo más tarde.');
    }
}

onUserCreated(userData: IUser) {
    console.log('User created successfully:', userData);
    this.saveFamilyMember(userData);
}

private showErrorMessage(message: string) {
    alert(message);
    
    console.error(message);
}

onChallengePagination(): void {
    this.challengeService.getMyChallenges();
}
}