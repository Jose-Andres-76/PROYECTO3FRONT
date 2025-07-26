import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-eco-rewards',
  templateUrl: './eco-rewards.component.html',
  styleUrls: ['./eco-rewards.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true
})
export class EcoRewardsComponent {
  coins = 1200;

  rewards = [
    { name: 'Salida a McDonald\'s', cost: 50 },
    { name: 'Videojuego', cost: 500 },
    { name: 'Día sin tareas', cost: 100 },
    { name: 'Día de descanso', cost: 200 },
    { name: 'Día de parque', cost: 300 },   

  ];

  claimReward(reward: any) {
    console.log(`Recompensa seleccionada: ${reward.name}`);
  }

  viewChallenges() {
    console.log('Ver retos');
  }
  
}
