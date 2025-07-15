import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
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
  
  @Input() memberForm!: FormGroup;
  @Input() isEditMode: boolean = false; // New input to determine if it's edit or create mode
  @Input() canManagePoints: boolean = true; // New input to control points management
  
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callSaveMethod: EventEmitter<IUser> = new EventEmitter<IUser>(); // New output for save
  @Output() callCancelMethod: EventEmitter<void> = new EventEmitter<void>(); // New output for cancel

  // Password visibility toggle
  public showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitForm() {
    if (this.memberForm.valid) {
      let member: IUser = {
        name: this.memberForm.controls['name'].value,
        lastname: this.memberForm.controls['lastname'].value,
        email: this.memberForm.controls['email'].value,
        password: this.memberForm.controls['password'].value,
        points: parseInt(this.memberForm.controls['points'].value) || 0
      };

      // Add age only when creating new member (not editing)
      if (!this.isEditMode && this.memberForm.controls['age']) {
        member.age = parseInt(this.memberForm.controls['age'].value) || undefined;
      }

      // Add ID only for edit mode
      if (this.isEditMode && this.memberForm.controls['id']) {
        member.id = parseInt(this.memberForm.controls['id'].value);
      }
      
      console.log(`${this.isEditMode ? 'Updating' : 'Creating'} member:`, member);
      
      if (this.isEditMode) {
        this.callUpdateMethod.emit(member);
      } else {
        this.callSaveMethod.emit(member);
      }
    } else {
      console.log('Form is invalid:', this.memberForm.errors);
      this.markFormGroupTouched();
    }
  }

  // Legacy method for backward compatibility
  callUpdate() {
    if (this.isEditMode) {
      this.submitForm();
    }
  }

  resetForm() {
    this.memberForm.reset();
    
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
    } else {
        // Edit mode - don't set age
        this.memberForm.patchValue({
            password: '', // Clear password but keep other fields
            points: this.memberForm.get('points')?.value || 0
        });
    }
    
    // Mark as pristine to avoid validation errors
    this.memberForm.markAsPristine();
    this.memberForm.markAsUntouched();
  }

  cancelAction() {
    this.callCancelMethod.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.memberForm.controls).forEach(key => {
      const control = this.memberForm.controls[key];
      control.markAsTouched();
      console.log(`${key}: valid=${control.valid}, value=${control.value}, errors=`, control.errors);
    });
  }
}