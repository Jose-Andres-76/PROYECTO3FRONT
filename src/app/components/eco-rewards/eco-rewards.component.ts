import { Component } from '@angular/core';

@Component({
  selector: 'app-eco-rewards',
  templateUrl: './eco-rewards.component.html',
  styleUrls: ['./eco-rewards.component.scss'],
  standalone: true
})
export class EcoRewardsComponent {
  coins = 1200;

  rewards = [
    { name: 'Salida a McDonald\'s', cost: 50 },
    { name: 'Videojuego', cost: 500 }
  ];

  claimReward(reward: any) {
    console.log(`Recompensa seleccionada: ${reward.name}`);
  }

  viewChallenges() {
    console.log('Ver retos');
  }
}
