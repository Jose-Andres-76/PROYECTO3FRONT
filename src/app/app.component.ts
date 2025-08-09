import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AlertService } from './services/alert.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy { 
  title: string = 'demo-angular-front';
  cant: number = 0;
  
  date: Date = new Date(); 
  
  private tokenCheckInterval: any;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
        const expiresIn = this.authService['expiresIn'];
        const timeLeft = expiresIn ? expiresIn - Date.now() : 0;
        console.log('Time left for token expiration:', timeLeft);
        this.tokenCheckInterval = setInterval(() => {

        const currentUrl = this.router.url;
        if (currentUrl.startsWith('/app')) {

        if (!this.authService.check()) {
          this.authService.logout();
          this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
          clearInterval(this.tokenCheckInterval);
        }
      }
    }, timeLeft); 
  }


  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }


  operation(name: string) {
    if (name == 'addition') {
      this.cant++;
    } else  if (name == 'subtraction') {
      this.cant--;
    }
  }

}
