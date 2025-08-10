import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../../services/auth.service';
import { RoleService } from '../../../services/role.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule, 
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  public roleService = inject(RoleService);
    
    public passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{}|\\\\:;"\'<>,.?/~`]).{8,}$';
    public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    
    @Input() title: string = 'Usuario';
    @Input() userForm!: FormGroup;
    @Input() isEditMode: boolean = false;
    @Input() canManagePoints: boolean = true;
    
    @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
    @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
    @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>();
    
    @Output() userCreated = new EventEmitter<IUser>();
    @Output() signupCancelled = new EventEmitter<void>();
  
    public showPassword: boolean = false;
    public signUpError: string = '';
    public validSignup: boolean = false;
    public isSubmitting: boolean = false;
  
    public user: IUser = {};
  userFormComponent: any;
  
    ngOnInit() {
      this.setupFormValidators();
      
      if (!this.isEditMode) {
        this.syncUserObjectWithForm();
      }
    }
  
    private setupFormValidators() {
      if (!this.isEditMode) {
        this.userForm.controls['password']?.setValidators([
          Validators.required,
          Validators.pattern(this.passwordPattern)
        ]);
        this.userForm.controls['age']?.setValidators([
          Validators.required,
          Validators.min(10), 
          Validators.max(120)
        ]);
        this.userForm.controls['id']?.clearValidators();
      } else {
        this.userForm.controls['password']?.setValidators([
          Validators.minLength(6)
        ]);
        this.userForm.controls['age']?.clearValidators();
        this.userForm.controls['id']?.setValidators([Validators.required]);
      }
      
      this.userForm.controls['email']?.setValidators([
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]);
      
      this.userForm.controls['name']?.setValidators([
        Validators.required,
        Validators.minLength(2)
      ]);
      
      this.userForm.controls['lastname']?.setValidators([
        Validators.required,
        Validators.minLength(2)
      ]);
      
      this.userForm.controls['points']?.setValidators([
        Validators.min(0),
        Validators.pattern(/^\d+$/)
      ]);

      this.userForm.controls['roleId']?.setValidators([
        Validators.required
      ]);
      
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.controls[key]?.updateValueAndValidity();
      });
    }
  
    private syncUserObjectWithForm() {
      this.userForm.valueChanges.subscribe(values => {
        this.user = {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          age: values.age,
          password: values.password,
          points: values.points || 0,
          role: this.roleService.items$().find(role => role.id.toString() === values.roleId)
        };
      });
    }
  
    public togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
    }
  
    submitForm() {
      this.signUpError = '';
      
      this.markFormGroupTouched();
      
      console.log('Form validation state:', {
        valid: this.userForm.valid,
        errors: this.userForm.errors,
        controls: Object.keys(this.userForm.controls).map(key => ({
          name: key,
          valid: this.userForm.controls[key].valid,
          errors: this.userForm.controls[key].errors,
          value: this.userForm.controls[key].value
        }))
      });
  
      if (this.userForm.valid) {
        this.isSubmitting = true;
        
        let member: IUser = {
          name: this.userForm.controls['name'].value?.trim(),
          lastname: this.userForm.controls['lastname'].value?.trim(),
          email: this.userForm.controls['email'].value?.trim().toLowerCase(),
          points: parseInt(this.userForm.controls['points'].value) || 0
        };

        const passwordValue = this.userForm.controls['password'].value;
        if (passwordValue && passwordValue.trim()) {
          member.password = passwordValue;
        }

        const roleId = parseInt(this.userForm.controls['roleId'].value);
        const selectedRole = this.roleService.items$().find(role => role.id === roleId);
        if (selectedRole) {
          member.role = selectedRole;
        }
  
        if (this.userForm.controls['age']) {
          const ageValue = parseInt(this.userForm.controls['age'].value);
          if (ageValue >= 10 && ageValue <= 120) {
            member.age = ageValue;
          } else {
            this.signUpError = 'Edad debe ser entre 10 y 120 años.';
            this.isSubmitting = false;
            return;
          }
        }
  
        if (this.isEditMode && this.userForm.controls['id']) {
          member.id = parseInt(this.userForm.controls['id'].value);
        }
  
        if (!this.validateMemberData(member)) {
          this.isSubmitting = false;
          return;
        }
        
        console.log(`${this.isEditMode ? 'Updating' : 'Creating'} member:`, member);
        
        if (this.isEditMode) {
          this.callUpdateMethod.emit(member);
          this.isSubmitting = false;
        } else {
          this.handleSignup(member);
        }
      } else {
        console.log('Form is invalid. Showing validation errors.');
        this.signUpError = 'Please correct the errors in the form before submitting.';
      }
    }
  
    private handleSignup(member: IUser) {
      console.log('Attempting to signup user:', member);
      
      this.authService.signupSon(member).subscribe({
        next: (response: any) => {
          console.log('Full signup response:', response);
          this.validSignup = true;
          this.isSubmitting = false;
          
          let userId = null;
          
          if (response?.id) {
            userId = response.id;
          } else if (response?.data?.id) {
            userId = response.data.id;
          } else if (response?.user?.id) {
            userId = response.user.id;
          } else if (response?.authUser?.id) {
            userId = response.authUser.id;
          }
          
          const createdUser: IUser = {
            id: userId,
            name: member.name,
            lastname: member.lastname,
            email: member.email,
            age: member.age,
            ...response.data,
            ...response.user,
            ...response.authUser
          };
          
          console.log('Created user with ID:', createdUser.id);
          console.log('Emitting created user:', createdUser);
          
          if (createdUser.id) {
            this.userCreated.emit(createdUser);
            this.callSaveMethod.emit(createdUser);
          } else {
            console.error('No user ID found in response:', response);
            this.signUpError = 'Usuario creado pero no se pudo obtener el ID.';
          }
        },
        error: (err: any) => {
          console.error('Signup error:', err);
          this.isSubmitting = false;
          this.validSignup = false;
          
          this.signUpError = err.description || err.message || 'Un error ocurrió al crear el usuario.';
        }
      });
    }
  
    private validateMemberData(member: IUser): boolean {
      if (!member.name || member.name.trim().length < 2) {
        this.signUpError = 'Nombre debe tener al menos 2 caracteres.';
        return false;
      }
      
      if (!member.lastname || member.lastname.trim().length < 2) {
        this.signUpError = 'Apellido debe tener al menos 2 caracteres.';
        return false;
      }
      
      if (!member.email) {
        this.signUpError = 'Email es requerido';
        return false;
      }
      
      const emailRegex = new RegExp(this.emailPattern);
      if (!emailRegex.test(member.email)) {
        this.signUpError = 'Por favor ingrese un email válido.';
        return false;
      }
      
      if (!this.isEditMode) {
        if (!member.password) {
          this.signUpError = 'Contraseña es requerida';
          return false;
        }
        const passwordRegex = new RegExp(this.passwordPattern);
        if (!passwordRegex.test(member.password)) {
          this.signUpError = 'Contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
          return false;
        }
      } else {
        if (member.password && member.password.length < 6) {
          this.signUpError = 'Contraseña debe tener al menos 6 caracteres.';
          return false;
        }
      }
      
      if (!this.isEditMode) {
        if (!member.age || member.age < 10 || member.age > 120) { 
          this.signUpError = 'Edad debe ser entre 10 y 120 años.';
          return false;
        }
      }
      
      return true;
    }
  
    public handleSuccess() {
      this.validSignup = true;
      this.isSubmitting = false;
      this.signUpError = '';
    }
  
    public handleError(error: string) {
      this.signUpError = error;
      this.isSubmitting = false;
      this.validSignup = false;
    }
  
    callUpdate() {
      if (this.isEditMode) {
        this.submitForm();
      }
    }
  
    public resetForm() {
      this.userForm.reset();
      this.signUpError = '';
      this.validSignup = false;
      this.isSubmitting = false;
      
      if (!this.isEditMode) {
        this.userForm.patchValue({
          id: '',
          name: '',
          lastname: '',
          email: '',
          age: 0,
          password: '',
          points: 0,
          roleId: ''
        });
        this.user = {};
      } else {
        // In edit mode, don't reset password to empty
        this.userForm.patchValue({
          // Don't reset password field in edit mode
          points: this.userForm.get('points')?.value || 0
        });
      }
      
      this.setupFormValidators();
      
      this.userForm.markAsPristine();
      this.userForm.markAsUntouched();
    }
  
    public cancelSignup() {
      this.signupCancelled.emit();
      this.callCancelMethod.emit();
    }
  
    cancelAction() {
      this.cancelSignup();
    }
  
    private markFormGroupTouched() {
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.controls[key];
        control.markAsTouched();
        if (control.invalid) {
          console.log(`${key}: valid=${control.valid}, value=${control.value}, errors=`, control.errors);
        }
      });
    }

    public getRoleDisplayName(role: any): string {
      if (role.name) {
        switch (role.name) {
          case 'FATHER':
            return 'Padre';
          case 'SON':
            return 'Hijo';
          case 'ADMIN':
            return 'Administrador';
          default:
            return role.name;
        }
      }
      return `Role ${role.id}`;
    }
  }
