import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/app-layout/elements/navbar/navbar.component';
import { EcoDashboardComponent } from '../../components/eco-dashboard/eco-dashboard.component';
import { EcoRewardsComponent } from '../../components/eco-rewards/eco-rewards.component';
import { EcoChallengesComponent } from '../../components/eco-challenges/eco-challenges.component';
import { FooterComponent } from '../../components/app-layout/elements/footer/footer.component';

@Component({
  selector: 'app-eco',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    EcoDashboardComponent,
    EcoRewardsComponent,
    EcoChallengesComponent,
    FooterComponent
  ],
  templateUrl: './eco.component.html',
  styleUrls: ['./eco.component.scss']
})
export class EcoComponent {}
export { EcoDashboardComponent };

