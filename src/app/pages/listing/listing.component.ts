import { Component, ViewChild } from "@angular/core";
import { UserListComponent } from "../../components/user/user-list/user-list.component";
import { FamilyListComponent } from "../../components/families/family-list/family-list.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { FamilyService } from "../../services/family.service";
import { inject } from "@angular/core";
import { ModalService } from "../../services/modal.service";
import { FormBuilder } from "@angular/forms";
import { UserFormComponent } from "../../components/user/user-from/user-form.component";
import { IFamily, IFamilyCreate, IUser } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { FamilyFormComponent } from "../../components/families/family-form/family-form.component";
import { SignUpFormForFamilyComponent } from "../../components/auth/sign-up/sign-up-form-for-family/sign-up-form-for-family.component";

@Component({
  selector: 'app-family',
    standalone: true,
    imports: [
        FamilyListComponent,
        FamilyFormComponent,
        PaginationComponent,
        ModalComponent,
        LoaderComponent,
        SignUpFormForFamilyComponent
    ],
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.scss'
})
export class ListingComponent {
  public familyService = inject(FamilyService);
  public authService = inject(AuthService);
  public modalService = inject(ModalService);
  
  @ViewChild('addFamilyModal') public addFamilyModal: any;
  public fb: FormBuilder = inject(FormBuilder); 

  public user = this.authService.getUser();
  public isCreatingFamily = false;
  public newSonUser: IUser | null = null;

  familyForm = this.fb.group({
    id: [''],
    idSon: [''],
    idFather: [''],
  });

    constructor() {
        this.familyService.search.page = 1;
        this.familyService.getAll();
    }

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
}