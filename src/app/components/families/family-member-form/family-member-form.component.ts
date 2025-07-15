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
  @Output() callUpdateMethod: EventEmitter<IUser> = new EventEmitter<IUser>();

  callUpdate() {
    if (this.memberForm.valid) {
      let member: IUser = {
        id: parseInt(this.memberForm.controls['id'].value),
        name: this.memberForm.controls['name'].value,
        lastname: this.memberForm.controls['lastname'].value,
        email: this.memberForm.controls['email'].value,
        password: this.memberForm.controls['password'].value,
        points: parseInt(this.memberForm.controls['points'].value) || 0
      };
      
      console.log('Updating member (without role):', member); // Debug log
      this.callUpdateMethod.emit(member);
    } else {
      console.log('Form is invalid:', this.memberForm.errors);
      Object.keys(this.memberForm.controls).forEach(key => {
        const control = this.memberForm.controls[key];
        console.log(`${key}: valid=${control.valid}, value=${control.value}, errors=`, control.errors);
      });
    }
  }
}