import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces';
import { MyAccountComponent } from '../../components/my-account/my-account.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MyAccountComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  public user?: IUser;
  public userName: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user && this.user.name) {
      this.userName = this.user.name;
    } else {
      const user = localStorage.getItem('auth_user');
      if (user) {
        this.userName = JSON.parse(user)?.name || '';
      }
    }
  }
}
