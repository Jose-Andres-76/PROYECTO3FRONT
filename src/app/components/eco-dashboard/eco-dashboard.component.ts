import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces';
import { MyAccountComponent } from '../../components/my-account/my-account.component';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-eco-dashboard',
  templateUrl: './eco-dashboard.component.html',
  styleUrls: ['./eco-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EcoDashboardComponent implements OnInit{

  private profileService = inject(ProfileService);

  coins = computed(() => this.profileService.user$()?.points || 0);

  playGame(game: string) {
    console.log(`Iniciando juego: ${game}`);
  }

  viewRewards() {
    console.log('Ver recompensas');
  }
    viewChallenges() {
    console.log('Ver retos');
  }
  public user?: IUser;
  public userName: string = '';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {

    this.profileService.getUserInfoSignal();
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