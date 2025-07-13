import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormsModule, NgModel} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LogoTituloComponent } from '../../../components/logo-titulo/logo-titulo.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,LogoTituloComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginError!: string;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('googleButtonContainer') googleButtonContainer!: ElementRef;

  public loginForm: { email: string; password: string } = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['expired'] === 'true') {
        this.loginError = 'Your session has expired. Please log in again.';
        setTimeout(() => {
          this.loginError = '';
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { expired: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }, 5000);
      }
    });
    this.authService.initializeGoogleSignIn();
  }

  ngAfterViewInit(): void {
    if (this.googleButtonContainer) {
      this.authService.renderGoogleSignInButton(this.googleButtonContainer.nativeElement);
    }
  }

  public handleLogin(event: Event) {
    event.preventDefault();
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.login(this.loginForm).subscribe({
        next: () => this.router.navigateByUrl('/app/dashboard'),
        error: (err: any) => (this.loginError = err.error.description),
      });
    }
  }
}
