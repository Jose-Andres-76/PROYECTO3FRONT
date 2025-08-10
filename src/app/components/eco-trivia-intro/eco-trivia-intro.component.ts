import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChallengeService } from '../../services/challenge.service';
import { IChallenge } from '../../interfaces';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-eco-trivia-intro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eco-trivia-intro.component.html',
  styleUrl: './eco-trivia-intro.component.scss'
})
export class EcoTriviaIntroComponent implements OnInit {

  ecoTriviaChallenges: IChallenge[] = [];
  private challenges$ = toObservable(this.challengeService.challenges$);

  constructor(
    private router: Router,
    private challengeService: ChallengeService
  ) { }

  ngOnInit(): void {
    this.challengeService.getMyChallenges();

    this.challenges$.subscribe((challenges: IChallenge[]) => {
      this.ecoTriviaChallenges = challenges.filter(
        c => c.game?.id === 3 && c.challengeStatus === true
      );
    });
  }

  comenzarTrivia(retoId?: number): void {
    if (!retoId) {
      console.warn('❌ El reto no tiene un ID válido.');
      return;
    }

    this.router.navigate(['/app/trivias'], { queryParams: { reto: retoId } });
  }
}
