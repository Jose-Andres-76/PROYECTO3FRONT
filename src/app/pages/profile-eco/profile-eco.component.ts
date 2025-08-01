import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  ngOnInit() {
    // Fetch user info when the component is initialized
    this.profileService.getUserInfoSignal();
    
    // Initialize form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });

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

      if (this.selectedFile) {
        // Update with profile picture
        const profileData = {
          name: formData.name,
          lastname: formData.lastname,
          age: formData.age,
          points: user.points || 0,
          image: this.selectedFile
        };
        this.editProfileService.saveProfilePicture(user.id, profileData);
      } else {
        // Update without profile picture
        alert("Dentro de Sin PROFILE");
        const updatedUser: IUser = {
          name: formData.name,
          lastname: formData.lastname,
          age: formData.age,
          points: user.points || 0,

        };
        alert("user.id: " + user.id);
        this.editProfileService.saveProfile(user.id, updatedUser);
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
    return this.previewUrl || this.profileService.user$().urlImage || '/assets/icons/default-user.png';
  }
}
