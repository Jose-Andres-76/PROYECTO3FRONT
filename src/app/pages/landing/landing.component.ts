import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/app-layout/elements/navbar/navbar.component';
import { HeroSectionComponent } from '../../components/landingComponents/hero-section/hero-section.component';
import { InfoCardsComponent } from '../../components/landingComponents/info-cards/info-cards.component';
import { FooterComponent } from '../../components/app-layout/elements/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroSectionComponent,
    InfoCardsComponent,
    FooterComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {}
