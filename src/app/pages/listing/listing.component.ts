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
import { IFamily } from "../../interfaces";
import { AuthService } from "../../services/auth.service";
import { FamilyFormComponent } from "../../components/families/family-form/family-form.component";

@Component({
  selector: 'app-family',
    standalone: true,
    imports: [
        FamilyListComponent,
        FamilyFormComponent,
        PaginationComponent,
        ModalComponent,
        LoaderComponent
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

  familyForm = this.fb.group({
    id: [''],
    idSon: [''],
    idFather: [''],
  });

    constructor() {
        this.familyService.search.page = 1;
        this.familyService.getAll();
    }

    
}