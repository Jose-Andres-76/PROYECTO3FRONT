import { Component, OnInit, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { IChallenge } from '../../interfaces';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-eco-trivia',
  standalone: true,
  templateUrl: './eco-trivia.component.html',
  styleUrls: ['./eco-trivia.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class EcoTriviaComponent implements OnInit {
  questions: any[][] = [];
  currentQuestionIndex: number[] = [];
  selectedOption: (string | null)[] = [];
  respuestaCorrecta: (boolean | null)[] = [];
  scores: number[] = [];
  completedChallenges = new Set<number>();
  ecoTriviaChallenges: IChallenge[] = [];
  userPoints: number = 0;
  mensajeFinal: string[] = [];

  private challengeService = inject(ChallengeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  private userId: number | null = null;
  private route = inject(ActivatedRoute);

  challenges = this.challengeService.challenges$;

  private challenges$ = toObservable(this.challengeService.challenges$);

  ngOnInit(): void {

    const retoIdParam = this.route.snapshot.queryParamMap.get('reto');
    const retoId = retoIdParam ? Number(retoIdParam) : null;
    const user = this.authService.getUser();
    this.userId = user?.id ?? null;

    if (!this.userId) {
      console.error('❌ Usuario no autenticado.');
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
      next: (updatedUser) => {
        this.userPoints = updatedUser.points ?? 0;
      }
    });

    this.challengeService.getMyChallenges();

    this.challenges$.subscribe((challenges: IChallenge[]) => {
      this.ecoTriviaChallenges = challenges.filter(
        c => c.game?.id === 3 && c.challengeStatus === true && (retoId === null || c.id === retoId)
      );

      this.ecoTriviaChallenges.forEach((reto, index) => {
        this.questions[index] = this.generateQuestions();
        this.currentQuestionIndex[index] = 0;
        this.selectedOption[index] = null;
        this.respuestaCorrecta[index] = null;
        this.scores[index] = 0;
        this.mensajeFinal[index] = '';
      });
    });
  }

  generateQuestions(): any[] {
    const pool = [
      {
        question: '¿Qué material se puede reciclar?',
        options: ['Papel sucio', 'Vidrio', 'Plásticos mezclados', 'Comida'],
        answer: 'Vidrio'
      },
      {
        question: '¿Dónde se debe colocar una botella plástica limpia?',
        options: ['Basura común', 'Contenedor verde', 'Contenedor azul', 'Contenedor amarillo'],
        answer: 'Contenedor amarillo'
      },
      {
        question: '¿Cuál es el color del contenedor para papel?',
        options: ['Rojo', 'Azul', 'Verde', 'Amarillo'],
        answer: 'Azul'
      },
      {
        question: '¿Cuál de estos no es reciclable?',
        options: ['Lata', 'Cartón', 'Cáscara de banana', 'Botella de vidrio'],
        answer: 'Cáscara de banana'
      },
      {
        question: '¿Qué significa reducir?',
        options: ['Comprar más', 'Usar menos recursos', 'Tirar cosas', 'Acumular residuos'],
        answer: 'Usar menos recursos'
      },
      {
        question: '¿Qué podés hacer con una caja de cartón usada?',
        options: ['Tirarla sin abrir', 'Quemarla', 'Usarla como casa para tu gato', 'Mojarla'],
        answer: 'Usarla como casa para tu gato'
      },
      {
        question: '¿Qué animal está en peligro por la contaminación plástica?',
        options: ['Tigre', 'Tortuga marina', 'Gato', 'Águila'],
        answer: 'Tortuga marina'
      },
      {
        question: '¿Cuál es una buena acción para cuidar el planeta?',
        options: ['Dejar luces encendidas', 'Reutilizar bolsas', 'Usar mucho papel', 'Tirar pilas al río'],
        answer: 'Reutilizar bolsas'
      },
      {
        question: '¿Qué es compostar?',
        options: ['Hacer una fiesta', 'Tirar la basura al mar', 'Convertir residuos orgánicos en abono', 'Comer plástico'],
        answer: 'Convertir residuos orgánicos en abono'
      },
      {
        question: '¿Qué contenedor se usa para latas y botellas?',
        options: ['Rojo', 'Negro', 'Amarillo', 'Celeste'],
        answer: 'Amarillo'
      },
      {
        question: '¿Qué es reciclar?',
        options: ['Usar algo una sola vez', 'Reutilizar materiales para crear algo nuevo', 'Tirar cosas al suelo', 'Romper cosas viejas'],
        answer: 'Reutilizar materiales para crear algo nuevo'
      },
      {
        question: '¿Cómo ayudás al planeta desde tu casa?',
        options: ['Tirando basura en la calle', 'Dejando el agua abierta', 'Separando los residuos', 'Usando muchos desechables'],
        answer: 'Separando los residuos'
      }
    ];

    const copiaPool = [...pool];
    const mezcladas = this.shuffleArray(copiaPool);
    return mezcladas.slice(0, 2);
  }


  shuffleArray(array: any[]): any[] {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  selectOption(option: string, index: number): void {
    this.selectedOption[index] = option;
  }

  submitAnswer(index: number, reto: IChallenge): void {
    if (!this.selectedOption[index]) return;

    const preguntaActual = this.questions[index][this.currentQuestionIndex[index]];
    const isCorrect = this.selectedOption[index] === preguntaActual.answer;
    this.respuestaCorrecta[index] = isCorrect;

    if (isCorrect) {
      this.scores[index] += 10;
    }


    setTimeout(() => {
      this.respuestaCorrecta[index] = null;
      this.selectedOption[index] = null;
      this.currentQuestionIndex[index]++;
      const finalizo = this.currentQuestionIndex[index] >= this.questions[index].length;

      if (finalizo && reto.id != null) {
        this.completedChallenges.add(reto.id);

        const cantidadPreguntas = this.questions[index].length;

        if (this.scores[index] === cantidadPreguntas * 10) {
          this.savePoints(reto);
          this.mensajeFinal[index] = '✅ ¡Trivia completada y ganaste puntos!';
        } else {
          this.mensajeFinal[index] = '☹️ Trivia completada, pero no ganaste puntos.';
        }
      }
    }, 1400);
  }

  savePoints(reto: IChallenge): void {
    if (!reto.points || !this.userId) return;

    const user = this.authService.getUser();
    const newPoints = (user?.points ?? 0) + reto.points;

    this.userService.updatePoints(this.userId, newPoints).subscribe({
      next: () => {
        this.userService.getUserById(this.userId!).subscribe({
          next: (updatedUser) => {
            this.userPoints = updatedUser.points ?? 0;
          }
        });
      }
    });
  }

  speak(text: string): void {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'es-CR';
    window.speechSynthesis.speak(speech);
  }

  back(): void {
    this.router.navigate(['/eco-challenges']);
  }
}
