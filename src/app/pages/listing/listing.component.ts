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
import { IFamily, IUser, IReward } from "../../interfaces";
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
  age: ['', [Validators.required, Validators.min(10), Validators.max(100)]], // Add age field
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

    openAddFamilyModal() {
    this.isCreatingFamily = false; // Set to false since we're using the unified form now
    
    // Reset the form completely
    this.memberForm.reset();
    
    // Setup form for create mode - add age validators
    this.memberForm.controls['age']?.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
    this.memberForm.controls['age']?.updateValueAndValidity();
    
    // Remove validators that are not needed for create mode (like ID)
    this.memberForm.controls['id']?.clearValidators();
    this.memberForm.controls['id']?.updateValueAndValidity();
    
    // Set default values for new member
    this.memberForm.patchValue({
        id: '',
        name: '',
        lastname: '',
        email: '',
        age: '',
        password: '',
        points: 0
    });
    
    // Mark form as pristine to avoid showing validation errors initially
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
            this.isCreatingFamily = false; // Set to false for edit mode
            
            this.currentMemberRole = family.son.role || {
                id: 2,
                name: 'ROLE_SON',
                description: 'Son Role'
            };

            // Reset form first
            this.memberForm.reset();
            
            // Setup form for edit mode - remove age validators and add ID validators
            this.memberForm.controls['age']?.clearValidators();
            this.memberForm.controls['age']?.updateValueAndValidity();
            
            this.memberForm.controls['id']?.setValidators([Validators.required]);
            this.memberForm.controls['id']?.updateValueAndValidity();

            // Set form values
            this.memberForm.patchValue({
                id: family.son.id !== undefined && family.son.id !== null ? String(family.son.id) : '',
                name: family.son.name || '',
                lastname: family.son.lastname || '',
                email: family.son.email || '',
                age: '', // Don't set age for edit mode
                password: '',
                points: family.son.points || 0
            });
            
            // Mark form as pristine to avoid showing validation errors initially
            this.memberForm.markAsPristine();
            this.memberForm.markAsUntouched();
            
            console.log('Form values set:', this.memberForm.value); 
            console.log('Son role:', family.son.role); 
            this.modalService.displayModal('md', this.editFamilyMemberModal);
        } else {
            console.error('No son data found in family:', family);
        }
    }

    // Add method to prepare form for creating new member
    openAddFamilyMemberModal() {
        // Reset form and add age validators for create mode
        this.memberForm.reset();
        this.memberForm.controls['age']?.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
        this.memberForm.controls['age']?.updateValueAndValidity();
        
        // Set default values
        this.memberForm.patchValue({
            points: 0
        });
        
        this.modalService.displayModal('md', this.editFamilyMemberModal);
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

    saveFamilyMember(member: IUser) {
    console.log('Saving new family member:', member);
    
    this.authService.signupSon(member).subscribe({
        next: (response: any) => {
            console.log('Family member created successfully:', response);
            
            let userId = response?.id || response?.data?.id || response?.user?.id || response?.authUser?.id;
            
            if (userId && this.user?.id) {
                const newFamily = {
                    father: { id: this.user.id },
                    son: { id: userId }
                };
                
                console.log('Creating family relationship:', newFamily);
                this.familyService.save(newFamily);
                this.closeAddFamilyModal();
                
                setTimeout(() => {
                    this.familyService.getAll();
                }, 500);
            } else {
                console.error('No user ID found in response:', response);
                this.showErrorMessage('User was created but no ID was returned. Please try again.');
            }
        },
        error: (err: any) => {
            console.error('Error creating family member:', err);
            
            // Handle specific errors
            if (err.status === 500 && err.error?.detail?.includes('Duplicate entry')) {
                if (err.error.detail.includes('UK_nkljxer1wsj6nrovrei620k5d')) {
                    this.showErrorMessage('A user with this email already exists. Please use a different email address.');
                } else {
                    this.showErrorMessage('This user already exists in the system. Please use different information.');
                }
            } else if (err.error?.detail) {
                this.showErrorMessage(`Error: ${err.error.detail}`);
            } else if (err.error?.message) {
                this.showErrorMessage(`Error: ${err.error.message}`);
            } else {
                this.showErrorMessage('An error occurred while creating the family member. Please try again.');
            }
        }
    });
}

private showErrorMessage(message: string) {
    alert(message);
    
    console.error(message);
}
private setupFormForMode(isEditMode: boolean, memberData?: IUser) {
    this.memberForm.reset();
    
    if (isEditMode && memberData) {
        this.memberForm.controls['age']?.clearValidators();
        this.memberForm.controls['id']?.setValidators([Validators.required]);
        
        this.memberForm.patchValue({
            id: memberData.id?.toString() || '',
            name: memberData.name || '',
            lastname: memberData.lastname || '',
            email: memberData.email || '',
            password: '',
            points: memberData.points || 0
        });
    } else {
        // Create mode setup
        this.memberForm.controls['age']?.setValidators([Validators.required, Validators.min(10), Validators.max(100)]);
        this.memberForm.controls['id']?.clearValidators();
        
        this.memberForm.patchValue({
            id: '',
            name: '',
            lastname: '',
            email: '',
            age: '',
            password: '',
            points: 0
        });
    }
    
    // Update validation and mark as pristine
    this.memberForm.controls['age']?.updateValueAndValidity();
    this.memberForm.controls['id']?.updateValueAndValidity();
    this.memberForm.markAsPristine();
    this.memberForm.markAsUntouched();
}
}