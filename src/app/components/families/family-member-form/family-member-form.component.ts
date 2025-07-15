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
  
  // NEW: Outputs matching sign-up-form-for-family
  @Output() userCreated = new EventEmitter<IUser>();
  @Output() signupCancelled = new EventEmitter<void>();

  // UI state properties (matching sign-up-form-for-family)
  public showPassword: boolean = false;
  public signUpError: string = '';
  public validSignup: boolean = false;
  public isSubmitting: boolean = false;

  // NEW: User object like in sign-up-form-for-family
  public user: IUser = {};

  ngOnInit() {
    this.setupFormValidators();
    
    // Initialize user object from form if in create mode
    if (!this.isEditMode) {
      this.syncUserObjectWithForm();
    }
  }

  private setupFormValidators() {
    if (!this.isEditMode) {
      // Create mode - strict validation like sign-up-form-for-family
      this.memberForm.controls['password']?.setValidators([
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]);
      this.memberForm.controls['age']?.setValidators([
        Validators.required,
        Validators.min(1), // Match sign-up-form-for-family (min="1")
        Validators.max(100)
      ]);
      this.memberForm.controls['id']?.clearValidators();
    } else {
      // Edit mode - more lenient password validation
      this.memberForm.controls['password']?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      this.memberForm.controls['age']?.clearValidators();
      this.memberForm.controls['id']?.setValidators([Validators.required]);
    }
    
    // Email validation for both modes
    this.memberForm.controls['email']?.setValidators([
      Validators.required,
      Validators.pattern(this.emailPattern)
    ]);
    
    // Name validations
    this.memberForm.controls['name']?.setValidators([
      Validators.required,
      Validators.minLength(2)
    ]);
    
    this.memberForm.controls['lastname']?.setValidators([
      Validators.required,
      Validators.minLength(2)
    ]);
    
    // Points validation
    this.memberForm.controls['points']?.setValidators([
      Validators.min(0),
      Validators.pattern(/^\d+$/)
    ]);
    
    // Update validity for all controls
    Object.keys(this.memberForm.controls).forEach(key => {
      this.memberForm.controls[key]?.updateValueAndValidity();
    });
  }

  // NEW: Sync user object with form values (from sign-up-form-for-family behavior)
  private syncUserObjectWithForm() {
    // Subscribe to form changes to keep user object in sync
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
    // Clear previous errors
    this.signUpError = '';
    
    // Mark all fields as touched to show validation errors (like sign-up-form-for-family)
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
      
      // Clean and prepare user data
      let member: IUser = {
        name: this.memberForm.controls['name'].value?.trim(),
        lastname: this.memberForm.controls['lastname'].value?.trim(),
        email: this.memberForm.controls['email'].value?.trim().toLowerCase(),
        password: this.memberForm.controls['password'].value,
        points: parseInt(this.memberForm.controls['points'].value) || 0
      };

      // Add age only when creating new member (not editing)
      if (!this.isEditMode && this.memberForm.controls['age']) {
        const ageValue = parseInt(this.memberForm.controls['age'].value);
        if (ageValue >= 1 && ageValue <= 100) { // Match sign-up-form-for-family validation
          member.age = ageValue;
        } else {
          this.signUpError = 'Age must be between 1 and 100 years.';
          this.isSubmitting = false;
          return;
        }
      }

      // Add ID only for edit mode
      if (this.isEditMode && this.memberForm.controls['id']) {
        member.id = parseInt(this.memberForm.controls['id'].value);
      }

      // Additional client-side validation
      if (!this.validateMemberData(member)) {
        this.isSubmitting = false;
        return;
      }
      
      console.log(`${this.isEditMode ? 'Updating' : 'Creating'} member:`, member);
      
      if (this.isEditMode) {
        this.callUpdateMethod.emit(member);
        this.isSubmitting = false;
      } else {
        // NEW: For create mode, call the auth service directly (like sign-up-form-for-family)
        this.handleSignup(member);
      }
    } else {
      console.log('Form is invalid. Showing validation errors.');
      this.signUpError = 'Please correct the errors in the form before submitting.';
    }
  }

  // NEW: Handle signup logic (EXACT copy from sign-up-form-for-family)
  private handleSignup(member: IUser) {
    console.log('Attempting to signup user:', member);
    
    this.authService.signupSon(member).subscribe({
      next: (response: any) => {
        console.log('Full signup response:', response);
        this.validSignup = true;
        this.isSubmitting = false;
        
        let userId = null;
        
        // EXACT logic from sign-up-form-for-family
        if (response?.id) {
          userId = response.id;
        } else if (response?.data?.id) {
          userId = response.data.id;
        } else if (response?.user?.id) {
          userId = response.user.id;
        } else if (response?.authUser?.id) {
          userId = response.authUser.id;
        }
        
        // EXACT user creation logic from sign-up-form-for-family
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
          // Emit both events for backward compatibility
          this.userCreated.emit(createdUser);
          this.callSaveMethod.emit(createdUser);
        } else {
          console.error('No user ID found in response:', response);
          this.signUpError = 'User was created but no ID was returned. Please try again.';
        }
      },
      error: (err: any) => {
        console.error('Signup error:', err);
        this.isSubmitting = false;
        this.validSignup = false;
        
        // EXACT error handling from sign-up-form-for-family
        this.signUpError = err.description || err.message || 'An error occurred during signup';
      }
    });
  }

  private validateMemberData(member: IUser): boolean {
    // Validate required fields
    if (!member.name || member.name.trim().length < 2) {
      this.signUpError = 'Name must be at least 2 characters long.';
      return false;
    }
    
    if (!member.lastname || member.lastname.trim().length < 2) {
      this.signUpError = 'Last name must be at least 2 characters long.';
      return false;
    }
    
    // FIXED: Proper email validation
    if (!member.email) {
      this.signUpError = 'Email is required.';
      return false;
    }
    
    const emailRegex = new RegExp(this.emailPattern);
    if (!emailRegex.test(member.email)) {
      this.signUpError = 'Please enter a valid email address.';
      return false;
    }
    
    if (!member.password) {
      this.signUpError = 'Password is required.';
      return false;
    }
    
    // Password validation based on mode
    if (!this.isEditMode) {
      const passwordRegex = new RegExp(this.passwordPattern);
      if (!passwordRegex.test(member.password)) {
        this.signUpError = 'Password must contain at least 8 characters including uppercase, lowercase, number and special character.';
        return false;
      }
    } else {
      if (member.password.length < 6) {
        this.signUpError = 'Password must be at least 6 characters long.';
        return false;
      }
    }
    
    // Age validation for create mode
    if (!this.isEditMode) {
      if (!member.age || member.age < 1 || member.age > 100) { // Match sign-up-form-for-family
        this.signUpError = 'Age must be between 1 and 100 years.';
        return false;
      }
    }
    
    return true;
  }

  // Method to handle success from parent component
  public handleSuccess() {
    this.validSignup = true;
    this.isSubmitting = false;
    this.signUpError = '';
  }

  // Method to handle error from parent component
  public handleError(error: string) {
    this.signUpError = error;
    this.isSubmitting = false;
    this.validSignup = false;
  }

  // Legacy method for backward compatibility
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
    
    // Set appropriate default values based on mode
    if (!this.isEditMode) {
        // Create mode defaults
        this.memberForm.patchValue({
            id: '',
            name: '',
            lastname: '',
            email: '',
            age: '',
            password: '',
            points: 0
        });
        
        // Reset user object
        this.user = {};
    } else {
        // Edit mode - don't set age
        this.memberForm.patchValue({
            password: '', // Clear password but keep other fields
            points: this.memberForm.get('points')?.value || 0
        });
    }
    
    // Re-setup validators after reset
    this.setupFormValidators();
    
    // Mark as pristine to avoid validation errors
    this.memberForm.markAsPristine();
    this.memberForm.markAsUntouched();
  }

  // NEW: Cancel signup method (from sign-up-form-for-family)
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