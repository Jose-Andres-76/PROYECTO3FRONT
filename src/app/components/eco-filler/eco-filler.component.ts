import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TextGameService } from '../../services/textgame.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

interface GameData {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-eco-filler',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eco-filler.component.html',
  styleUrl: './eco-filler.component.scss'
})
export class EcoFillerComponent implements OnInit {
  private textGameService = inject(TextGameService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  
  currentGame = signal<GameData | null>(null);
  score = signal<number>(0);
  userTotalPoints = signal<number>(0);
  isAnswered = signal<boolean>(false);
  selectedAnswer = signal<string>('');
  isCorrect = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isUpdatingPoints = signal<boolean>(false);
  
  currentQuestion = signal<number>(1);
  maxQuestions = 10;
  sessionCompleted = signal<boolean>(false);

  ngOnInit() {
    this.loadUserPoints();
    this.loadNewGame();
  }

  loadUserPoints() {
    const currentUser = this.authService.getUser();
    if (currentUser && currentUser.points !== undefined) {
      this.userTotalPoints.set(currentUser.points);
    }
  }

  async loadNewGame() {
    // Check if session is completed
    if (this.currentQuestion() > this.maxQuestions) {
      this.sessionCompleted.set(true);
      this.showSessionCompletedMessage();
      return;
    }

    this.isLoading.set(true);
    this.isAnswered.set(false);
    this.selectedAnswer.set('');
    
    try {
      const gameData = await this.textGameService.getOneRandomTextGame();
      if (gameData) {
        console.log('Game data received:', gameData);
        this.currentGame.set(gameData);
      }
    } catch (error) {
      console.error('Error loading game:', error);
      this.alertService.displayAlert('error', 'No se pudo cargar el juego', 'center', 'top', ['error-snackbar']);
    } finally {
      this.isLoading.set(false);
    }
  }

  async selectOption(option: string) {
    if (this.isAnswered()) return;

    this.selectedAnswer.set(option);
    this.isAnswered.set(true);
    
    const currentGameData = this.currentGame();
    if (currentGameData) {
      const correct = option.toLowerCase() === currentGameData.answer.toLowerCase();
      this.isCorrect.set(correct);
      
      if (correct) {
        this.score.update(current => current + 5);
        
        await this.updateUserPoints(5);
        
        this.alertService.displayAlert('success', '¡Respuesta correcta! +5 puntos', 'center', 'top', ['success-snackbar']);
      } else {
        this.alertService.displayAlert('error', `Respuesta incorrecta. La respuesta correcta era: ${currentGameData.answer}`, 'center', 'top', ['error-snackbar']);
      }
    }
  }

  async updateUserPoints(pointsToAdd: number) {
    const currentUser = this.authService.getUser();
    if (!currentUser || !currentUser.id) {
      console.error('No user logged in');
      return;
    }

    this.isUpdatingPoints.set(true);
    
    try {
      const newTotalPoints = this.userTotalPoints() + pointsToAdd;
      
      const response = await this.userService.updatePoints(currentUser.id, newTotalPoints).toPromise();
      
      this.userTotalPoints.set(newTotalPoints);
      
      const updatedUser = { ...currentUser, points: newTotalPoints };
      this.updateUserInAuth(updatedUser);
      
      console.log('Points updated successfully:', response);
      
    } catch (error) {
      console.error('Error updating points:', error);
      this.alertService.displayAlert('error', 'Error al actualizar los puntos', 'center', 'top', ['error-snackbar']);
    } finally {
      this.isUpdatingPoints.set(false);
    }
  }

  private updateUserInAuth(updatedUser: any) {
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }

  nextQuestion() {
    this.currentQuestion.update(current => current + 1);
    this.loadNewGame();
  }

  startNewSession() {
    this.currentQuestion.set(1);
    this.score.set(0);
    this.sessionCompleted.set(false);
    this.loadNewGame();
  }

  goBackToModuloInfantil() {
    this.router.navigate(['/app/Eco']);
  }

  private showSessionCompletedMessage() {
    const finalScore = this.score();
    const questionsAnswered = this.maxQuestions;
    const accuracy = Math.round((finalScore / (questionsAnswered * 5)) * 100);
    
    this.alertService.displayAlert(
      'success', 
      `¡Sesión completada! Puntuación: ${finalScore}/${questionsAnswered * 5} (${accuracy}% de acierto)`, 
      'center', 
      'top', 
      ['success-snackbar']
    );
  }

  getButtonClass(option: string): string {
    if (!this.isAnswered()) {
      return 'option-button';
    }
    
    const currentGameData = this.currentGame();
    if (!currentGameData) return 'option-button';
    
    const isCorrectAnswer = option.toLowerCase() === currentGameData.answer.toLowerCase();
    const isSelectedOption = option === this.selectedAnswer();
    
    if (isCorrectAnswer) {
      return 'option-button correct';
    } else if (isSelectedOption && !isCorrectAnswer) {
      return 'option-button incorrect';
    } else {
      return 'option-button disabled';
    }
  }

  get questionsRemaining(): number {
    return this.maxQuestions - this.currentQuestion() + 1;
  }
}
