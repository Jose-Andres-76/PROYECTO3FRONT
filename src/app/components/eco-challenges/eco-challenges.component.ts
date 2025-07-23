import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eco-challenges',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './eco-challenges.component.html',
  styleUrls: ['./eco-challenges.component.scss'],
})
export class EcoChallengesComponent {
  challenges = [
    { description: 'Recicla plástico', done: false, points: 10 },
    { description: 'Usa transporte público', done: false, points: 20 },
    { description: 'Reduce consumo de agua', done: false, points: 15 },
  ];

  coins = 0;

  viewRewards() {
    console.log('Ver recompensas');
  }
}


