import { Component, ViewChild } from "@angular/core";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { FamilyListComponent } from "../../components/families/family-list/family-list.component";
import { RewardListComponent } from "../../components/reward/reward-list/reward-list.component";
import { RewardFormComponent } from "../../components/reward/reward-form/reward-form.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { FamilyService } from "../../services/family.service";
import { RewardService } from "../../services/reward.service";
import { inject } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { IFamily, IFamilyCreate, IUser, IReward } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { FamilyFormComponent } from "../../components/families/family-form/family-form.component";
import { SignUpFormForFamilyComponent } from "../../components/auth/sign-up/sign-up-form-for-family/sign-up-form-for-family.component";
import { FamilyMemberFormComponent } from "../../components/families/family-member-form/family-member-form.component";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-family',
    standalone: true,
    imports: [
        FamilyListComponent,
        RewardListComponent,
        RewardFormComponent,
        FamilyFormComponent,
        PaginationComponent,
        ModalComponent,
        LoaderComponent,
        SignUpFormForFamilyComponent,
        FamilyMemberFormComponent
    ],
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.scss'
})
export class ListingComponent {
  public familyService = inject(FamilyService);
  public rewardService = inject(RewardService);
  public authService = inject(AuthService);
  public modalService = inject(ModalService);
  public userService = inject(UserService);
  
  @ViewChild('addFamilyModal') public addFamilyModal: any;
  @ViewChild('editFamilyMemberModal') public editFamilyMemberModal: any;
  @ViewChild('addRewardModal') public addRewardModal: any;
  @ViewChild('editRewardModal') public editRewardModal: any;
  public fb: FormBuilder = inject(FormBuilder); 

  public user = this.authService.getUser();
  public isCreatingFamily = false;
  public newSonUser: IUser | null = null;
  public selectedReward: IReward | null = null;

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

  private currentMemberRole: any = null;

    constructor() {
        this.familyService.search.page = 1;
        this.familyService.getAll();
        
        this.rewardService.search.page = 1;
        this.rewardService.getMyRewards();
    }

    // Family methods (existing)
    openAddFamilyModal() {
        this.isCreatingFamily = true;
        this.newSonUser = null;
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
            this.currentMemberRole = family.son.role || {
                id: 2,
                name: 'ROLE_SON',
                description: 'Son Role'
            };

            this.memberForm.controls['id'].setValue(family.son.id !== undefined && family.son.id !== null ? String(family.son.id) : '');
            this.memberForm.controls['name'].setValue(family.son.name || '');
            this.memberForm.controls['lastname'].setValue(family.son.lastname || '');
            this.memberForm.controls['email'].setValue(family.son.email || '');
            this.memberForm.controls['password'].setValue('');
            this.memberForm.controls['points'].setValue(family.son.points || 0);
            
            console.log('Form values set:', this.memberForm.value); 
            console.log('Son role:', family.son.role); 
            this.modalService.displayModal('md', this.editFamilyMemberModal);
        } else {
            console.error('No son data found in family:', family);
        }
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
            this.familyService.getAll();
        }, 500);
    }

    // Reward methods
    openAddRewardModal() {
        this.selectedReward = null;
        this.modalService.displayModal('md', this.addRewardModal);
    }

    callRewardEdition(reward: IReward) {
        console.log('Editing reward:', reward);
        this.selectedReward = reward;
        this.modalService.displayModal('md', this.editRewardModal);
    }

    getSelectedReward(): IReward | undefined {
        return this.selectedReward || undefined;
    }

    saveReward(reward: IReward) {
        console.log('=== LISTING COMPONENT SAVE REWARD ===');
        console.log('Received reward object:', reward);
        
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
}