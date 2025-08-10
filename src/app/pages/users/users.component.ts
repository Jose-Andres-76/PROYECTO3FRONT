import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { UserFormComponent } from '../../components/user/user-form/user-form.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { RoleService } from '../../services/role.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    PaginationComponent,
    ModalComponent,
    LoaderComponent,
    UserFormComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  public userService: UserService = inject(UserService);
  public roleService: RoleService = inject(RoleService);
  
  public modalService: ModalService = inject(ModalService);
  @ViewChild('addUsersModal') public addUsersModal: any;
  @ViewChild(UserFormComponent) public userFormComponent!: UserFormComponent;
  
  public fb: FormBuilder = inject(FormBuilder);
  
  // Search functionality
  public searchEmail: string = '';
  public searchedUser: IUser | null = null;
  public isSearching: boolean = false;
  public hasSearched: boolean = false;
  public searchError: string = '';
  
  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    password: ['', Validators.required],
    points: [0, [Validators.min(0)]],
    age: [0, [Validators.min(10), Validators.max(120)]],
    roleId: ['', Validators.required] 
  })

  ngOnInit() {
    this.userService.search.page = 1;
    this.userService.getAll();
  }
    
  public isEditMode: boolean = false;

  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
    this.roleService.getAll(); 
  }

  // Search methods
  searchUserByEmail() {
    if (!this.searchEmail.trim()) {
      this.clearSearch();
      return;
    }

    this.isSearching = true;
    this.searchError = '';
    
    this.userService.getUserByEmail(this.searchEmail.trim()).subscribe({
      next: (response: any) => {
        this.searchedUser = response.data || response;
        this.hasSearched = true;
        this.isSearching = false;
      },
      error: (err: any) => {
        this.searchedUser = null;
        this.hasSearched = true;
        this.isSearching = false;
        this.searchError = 'No hay usuarios con este email';
      }
    });
  }

  clearSearch() {
    this.searchEmail = '';
    this.searchedUser = null;
    this.hasSearched = false;
    this.searchError = '';
    this.isSearching = false;
  }

  onSearchInputChange() {
    if (!this.searchEmail.trim()) {
      this.clearSearch();
    }
  }

  openAddUserModal() {
    this.isEditMode = false;
    this.resetForm();
    this.modalService.displayModal('lg', this.addUsersModal);
  }

  saveUser(user: IUser) {
    this.userService.save(user);
    this.modalService.closeAll();
    this.resetForm();
  }

  callEdition(user: IUser) {
    this.userForm.controls['id'].setValue(user.id ? JSON.stringify(user.id) : '');
    this.userForm.controls['email'].setValue(user.email ? user.email : '');
    this.userForm.controls['name'].setValue(user.name ? user.name : '');
    this.userForm.controls['lastname'].setValue(user.lastname ? user.lastname : '');
    
    this.isEditMode = true;
    this.userForm.patchValue({
      id: user.id?.toString() || '',
      email: user.email || '',
      name: user.name || '',
      lastname: user.lastname || '',
      points: user.points || 0,
      age: user.age || 0,
      roleId: user.role?.id?.toString() || '' 
    });
    this.modalService.displayModal('lg', this.addUsersModal);
  }

  updateUser(user: IUser) {
    this.userService.update(user);
    this.modalService.closeAll();
    this.resetForm();
  }

  private resetForm() {
    this.userForm.reset();
    this.userForm.patchValue({
      id: '',
      email: '',
      name: '',
      lastname: '',
      password: '',
      points: 0,
      age: 0,
      roleId: ''
    });
    
    if (this.userFormComponent) {
      this.userFormComponent.resetForm();
    }
  }

  onModalClose() {
    this.modalService.closeAll();
    this.resetForm();
    this.isEditMode = false;
  }
}
