import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';

@Component({
  selector: 'app-sign-up-form-for-family',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up-form-for-family.component.html',
  styleUrl: './sign-up-form-for-family.component.scss'
})
export class SignUpFormForFamilyComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  public passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{}|\\\\:;"\'<>,.?/~`]).{8,}$';
  public emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  public showPassword: boolean = false;
  
  @ViewChild('name') nameModel!: NgModel;
  @ViewChild('lastname') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('age') ageModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;

  @Output() userCreated = new EventEmitter<IUser>();
  @Output() signupCancelled = new EventEmitter<void>();

  public user: IUser = {};

  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public handleSignup(event: Event) {
    event.preventDefault();
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.ageModel.valid) {
      this.ageModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.nameModel.valid && this.lastnameModel.valid && this.emailModel.valid && this.ageModel.valid && this.passwordModel.valid) {
      console.log('Attempting to signup user:', this.user);
      
      this.authService.signup(this.user).subscribe({
        next: (response: any) => {
          console.log('Full signup response:', response);
          this.validSignup = true;
          
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
            name: this.user.name,
            lastname: this.user.lastname,
            email: this.user.email,
            age: this.user.age,
            ...response.data,
            ...response.user,
            ...response.authUser
          };
          
          console.log('Created user with ID:', createdUser.id);
          console.log('Emitting created user:', createdUser);
          
          if (createdUser.id) {
            this.userCreated.emit(createdUser);
          } else {
            console.error('No user ID found in response:', response);
            this.signUpError = 'User was created but no ID was returned. Please try again.';
          }
        },
        error: (err: any) => {
          console.error('Signup error:', err);
          this.signUpError = err.description || err.message || 'An error occurred during signup';
        },
      });
    }
  }

  public cancelSignup() {
    this.signupCancelled.emit();
  }
}