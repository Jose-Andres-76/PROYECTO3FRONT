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

@Component({
  selector: 'app-family',
    standalone: true,
    imports: [
        FamilyListComponent,
        // UserListComponent,
        // UserFormComponent,
        PaginationComponent,
        ModalComponent,
        LoaderComponent
    ],
    templateUrl: './family.component.html',
    styleUrl: './family.component.scss'
})
export class FamilyComponent {
  public familyService = inject(FamilyService);
  public modalService = inject(ModalService);
  @ViewChild('addFamilyModal') public addFamilyModal: any;
  public fb: FormBuilder = inject(FormBuilder);    
  userForm = this.fb.group({
    id: [''],
    idSon: [''],
    idFather: [''],
  });

    constructor() {
        this.familyService.search.page = 1;
        this.familyService.getAll();
    }
}