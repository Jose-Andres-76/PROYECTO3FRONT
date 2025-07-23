import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-family-member-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './family-member-form.component.html',
  styleUrl: './family-member-form.component.scss'
})
export class FamilyMemberFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  // Validation patterns from sign-up-form-for-family (EXACT MATCH)
  public passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{}|\\\\:;"\'<>,.?/~`]).{8,}$';
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  
  @Input() title: string = 'Miembro de Familia';
  @Input() memberForm!: FormGroup;
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

  ngOnInit() {
    this.setupFormValidators();
    
    if (!this.isEditMode) {
      this.syncUserObjectWithForm();
    }
  }

  private setupFormValidators() {
    if (!this.isEditMode) {
      this.memberForm.controls['password']?.setValidators([
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]);
      this.memberForm.controls['age']?.setValidators([
        Validators.required,
        Validators.min(1), 
        Validators.max(100)
      ]);
      this.memberForm.controls['id']?.clearValidators();
    } else {
      this.memberForm.controls['password']?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      this.memberForm.controls['age']?.clearValidators();
      this.memberForm.controls['id']?.setValidators([Validators.required]);
    }
    
    this.memberForm.controls['email']?.setValidators([
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
    
    this.memberForm.controls['name']?.setValidators([
      Validators.required,
      Validators.minLength(2)
    ]);
    
    this.memberForm.controls['lastname']?.setValidators([
      Validators.required,
      Validators.minLength(2)
    ]);
    
    this.memberForm.controls['points']?.setValidators([
      Validators.min(0),
      Validators.pattern(/^\d+$/)
    ]);
    
    Object.keys(this.memberForm.controls).forEach(key => {
      this.memberForm.controls[key]?.updateValueAndValidity();
    });
  }

  private syncUserObjectWithForm() {
    this.memberForm.valueChanges.subscribe(values => {
      this.user = {
        name: values.name,
        lastname: values.lastname,
        email: values.email,
        age: values.age,
        password: values.password,
        points: values.points || 0
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
      valid: this.memberForm.valid,
      errors: this.memberForm.errors,
      controls: Object.keys(this.memberForm.controls).map(key => ({
        name: key,
        valid: this.memberForm.controls[key].valid,
        errors: this.memberForm.controls[key].errors,
        value: this.memberForm.controls[key].value
      }))
    });

    if (this.memberForm.valid) {
      this.isSubmitting = true;
      
      let member: IUser = {
        name: this.memberForm.controls['name'].value?.trim(),
        lastname: this.memberForm.controls['lastname'].value?.trim(),
        email: this.memberForm.controls['email'].value?.trim().toLowerCase(),
        password: this.memberForm.controls['password'].value,
        points: parseInt(this.memberForm.controls['points'].value) || 0
      };

      if (!this.isEditMode && this.memberForm.controls['age']) {
        const ageValue = parseInt(this.memberForm.controls['age'].value);
        if (ageValue >= 1 && ageValue <= 100) {
          member.age = ageValue;
        } else {
          this.signUpError = 'Edad debe ser entre 1 y 100 años.';
          this.isSubmitting = false;
          return;
        }
      }

      if (this.isEditMode && this.memberForm.controls['id']) {
        member.id = parseInt(this.memberForm.controls['id'].value);
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
    
    if (!member.password) {
      this.signUpError = 'Contraseña es requerida';
      return false;
    }
    
    if (!this.isEditMode) {
      const passwordRegex = new RegExp(this.passwordPattern);
      if (!passwordRegex.test(member.password)) {
        this.signUpError = 'Contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.';
        return false;
      }
    } else {
      if (member.password.length < 6) {
        this.signUpError = 'Contraseña debe tener al menos 6 caracteres.';
        return false;
      }
    }
    
    if (!this.isEditMode) {
      if (!member.age || member.age < 10 || member.age > 100) { 
        this.signUpError = 'Edad debe ser entre 10 y 100 años.';
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

  resetForm() {
    this.memberForm.reset();
    this.signUpError = '';
    this.validSignup = false;
    this.isSubmitting = false;
    
    if (!this.isEditMode) {
        this.memberForm.patchValue({
            id: '',
            name: '',
            lastname: '',
            email: '',
            age: '',
            password: '',
            points: 0
        });
        this.user = {};
    } else {
        this.memberForm.patchValue({
            password: '',
            points: this.memberForm.get('points')?.value || 0
        });
    }
    
    this.setupFormValidators();
    
    this.memberForm.markAsPristine();
    this.memberForm.markAsUntouched();
  }

  public cancelSignup() {
    this.signupCancelled.emit();
    this.callCancelMethod.emit();
  }

  cancelAction() {
    this.cancelSignup();
  }

  private markFormGroupTouched() {
    Object.keys(this.memberForm.controls).forEach(key => {
      const control = this.memberForm.controls[key];
      control.markAsTouched();
      if (control.invalid) {
        console.log(`${key}: valid=${control.valid}, value=${control.value}, errors=`, control.errors);
      }
    });
  }
}