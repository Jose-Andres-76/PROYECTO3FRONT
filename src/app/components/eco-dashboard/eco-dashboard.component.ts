import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eco-dashboard',
  templateUrl: './eco-dashboard.component.html',
  styleUrls: ['./eco-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EcoDashboardComponent {
  user = {
    name: 'Invitado'
  };

  coins = 1200;

  playGame(game: string) {
    console.log(`Iniciando juego: ${game}`);
  }

  viewRewards() {
    console.log('Ver recompensas');
  }
    viewChallenges() {
    console.log('Ver retos');
  }
}