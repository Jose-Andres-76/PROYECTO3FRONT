import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Procesando autenticación con Google...</p>
      </div>
    </div>
  `
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const expiresIn = params['expiresIn'];
      
      if (token) {
        // Store the token and redirect to dashboard
        this.authService.handleGoogleCallback(token, expiresIn);
        this.router.navigate(['/app/dashboard']);
      } else {
        // Handle error case
        console.error('No token received from Google authentication');
        this.router.navigate(['/login']);
      }
    });
  }
} 