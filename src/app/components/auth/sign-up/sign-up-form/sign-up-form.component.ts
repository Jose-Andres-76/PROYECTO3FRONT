import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent implements OnInit, AfterViewInit {
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
  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  public user: IUser = {};

  constructor(private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.initializeGoogleSignIn();
  }

  ngAfterViewInit(): void {
    if (this.googleButtonContainer) {
      this.authService.renderGoogleSignInButton(this.googleButtonContainer.nativeElement);
    }
  }

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
      this.authService.signup(this.user).subscribe({
        next: () => this.validSignup = true,
        error: (err: any) => (this.signUpError = err.description),
      });
    }
  }
}
