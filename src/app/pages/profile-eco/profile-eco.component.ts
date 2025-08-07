import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { EditProfileServiceService } from '../../services/edit-profile-service.service';
import { IUser } from '../../interfaces';

@Component({
  selector: 'app-profile-eco',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-eco.component.html',
  styleUrl: './profile-eco.component.scss'
})
export class ProfileEcoComponent implements OnInit {
  public profileService = inject(ProfileService);
  private editProfileService = inject(EditProfileServiceService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{}|\\\\:;"\'<>,.?/~`]).{8,}$';
  showPassword = false;
  showConfirmPassword = false;
  showCurrentPassword = false;

  ngOnInit() {
    // Fetch user info when the component is initialized
    const user = this.profileService.getUserInfoSignal();
    console.log("user: ", user);
    
    // Initialize form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      currentPassword: [''],
      password: ['', [Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['']
    }, { validators: [this.passwordMatchValidator, this.currentPasswordValidator] });

    // Watch for user data changes and populate form
    effect(() => {
      const user = this.profileService.user$();
      if (user && user.id) {
        this.profileForm.patchValue({
          name: user.name || '',
          lastname: user.lastname || '',
          age: user.age || ''
        });
        this.previewUrl = user.urlImage || null;
      }
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Custom validator to check if current password is provided when changing password
  currentPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const currentPassword = control.get('currentPassword');
    const newPassword = control.get('password');
    
    if (newPassword && newPassword.value && newPassword.value.trim() !== '') {
      if (!currentPassword || !currentPassword.value || currentPassword.value.trim() === '') {
        return { currentPasswordRequired: true };
      }
    }
    return null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    fileInput?.click();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const user = this.profileService.user$();
      const formData = this.profileForm.value;

      if (!user.id) {
        console.error('User ID is required for profile update');
        return;
      }

      // Prepare base profile data
      const baseProfileData = {
        name: formData.name,
        lastname: formData.lastname,
        age: formData.age,
        points: user.points || 0
      };

      // Add password fields only if user is changing password
      if (formData.password && formData.password.trim() !== '') {
        (baseProfileData as any).password = formData.password;
        (baseProfileData as any).currentPassword = formData.currentPassword || '';
      }

      if (this.selectedFile) {
        // Update with profile picture
        const profileData = {
          ...baseProfileData,
          password: formData.password || '',
          currentPassword: formData.currentPassword || '',
          image: this.selectedFile
        };
        this.editProfileService.saveProfilePicture(user.id, profileData);
      } else {

        const profileDataNoPicture = {
          ...baseProfileData,
          password: formData.password || '',
          currentPassword: formData.currentPassword || '' };
        // const updatedUser = baseProfileData as IUser & { currentPassword?: string };
        this.editProfileService.saveProfileNormal(user.id, profileDataNoPicture);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  getCurrentUserEmail(): string {
    return this.profileService.user$().email || '';
  }

  getProfileImageUrl(): string {
    return this.previewUrl || this.profileService.user$().urlImage || '/assets/icons/sidebar/child-reaching-solid.svg';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
}
