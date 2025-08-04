import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ChallengeService } from './challenge.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { IChallenge } from '../interfaces';

export interface GameResult {
  success: boolean;
  totalCorrect: number;
  totalErrors: number;
  pointsEarned: number;
  challengeCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameIntegrationService {
  private readonly challengeService = inject(ChallengeService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);

  private readonly ECO_DRAG_DROP_GAME_ID = 1;
  private readonly ECO_TRIVIA_GAME_ID = 3;

  processGameResult(gameResult: GameResult, gameId?: number): Observable<any> {
    const currentUser = this.authService.getUser();
    
    if (!currentUser?.id) {
      this.alertService.displayAlert('error', 'Usuario no autenticado', 'center', 'top', ['error-snackbar']);
      return of(null);
    }

    console.log('Processing game result:', gameResult);

    if (!gameResult.success) {
      return of({ success: false, message: 'Juego no completado exitosamente' });
    }

    return this.checkActiveChallenges(currentUser.id, gameId).pipe(
      switchMap((activeChallenges) => {
        let pointsEarned: number;
        let challengeCompleted = false;

        if (activeChallenges.length > 0) {
          const activeChallenge = activeChallenges[0];
          pointsEarned = activeChallenge.points || 0;
          challengeCompleted = true;
        } else {
          pointsEarned = 0;
        }

        if (pointsEarned > 0) {
          return this.userService.getUserById(currentUser.id!).pipe(
            switchMap((userResponse: any) => {
              const currentPoints = userResponse.data?.points || 0;
              const newTotalPoints = currentPoints + pointsEarned;

              return this.userService.updateUserPoints(currentUser.id!, newTotalPoints).pipe(
                switchMap(() => {
                  if (challengeCompleted && activeChallenges.length > 0) {
                    return this.challengeService.completeChallenge(activeChallenges[0].id!).pipe(
                      map(() => ({
                        success: true,
                        pointsEarned,
                        newTotalPoints,
                        challengeCompleted: true,
                        message: `Desafío completado. Has ganado ${pointsEarned} puntos`
                      })),
                      catchError(() => of({
                        success: true,
                        pointsEarned,
                        newTotalPoints,
                        challengeCompleted: false,
                        message: `Has ganado ${pointsEarned} puntos`
                      }))
                    );
                  } else {
                    return of({
                      success: true,
                      pointsEarned,
                      newTotalPoints,
                      challengeCompleted: false,
                      message: `Has ganado ${pointsEarned} puntos`
                    });
                  }
                })
              );
            })
          );
        } else {
          return of({
            success: true,
            pointsEarned: 0,
            newTotalPoints: 0,
            challengeCompleted: false,
            message: 'Juego completado. Acepta un desafío para ganar puntos.'
          });
        }
      }),
      catchError((error) => {
        console.error('Error processing game result:', error);
        this.alertService.displayAlert('error', 'Error procesando resultado del juego', 'center', 'top', ['error-snackbar']);
        return of({ success: false, error: error.message });
      })
    );
  }

  checkActiveChallenges(userId?: number, gameId?: number): Observable<IChallenge[]> {
    const targetUserId = userId || this.authService.getUser()?.id;
    const targetGameId = gameId || this.ECO_DRAG_DROP_GAME_ID;
    
    if (!targetUserId) {
      return of([]);
    }

    return this.challengeService.getActiveChallengesByUserAndGame(targetUserId, targetGameId).pipe(
      map((response: any) => {
        const challenges = response.data || response || [];
        return challenges.filter((challenge: IChallenge) => 
          challenge.challengeStatus === true
        );
      }),
      catchError(() => of([]))
    );
  }

  processEcoTriviaResult(challengeId: number, score: number, totalQuestions: number): Observable<any> {
    const currentUser = this.authService.getUser();
    
    if (!currentUser?.id) {
      this.alertService.displayAlert('error', 'Usuario no autenticado', 'center', 'top', ['error-snackbar']);
      return of(null);
    }

    const success = score === totalQuestions * 10;
    
    if (!success) {
      return of({ 
        success: false, 
        message: 'Necesitas responder todas las preguntas correctamente para ganar puntos' 
      });
    }

    return this.challengeService.getActiveChallengesByUserAndGame(currentUser.id, this.ECO_TRIVIA_GAME_ID).pipe(
      switchMap((activeChallenges) => {
        const activeChallenge = activeChallenges.find((c: IChallenge) => c.id === challengeId);
        
        if (!activeChallenge) {
          return of({ 
            success: false, 
            message: 'Desafío no encontrado o ya completado' 
          });
        }

        const pointsEarned = activeChallenge.points || 0;

        return this.userService.getUserById(currentUser.id!).pipe(
          switchMap((userResponse: any) => {
            const currentPoints = userResponse.data?.points || 0;
            const newTotalPoints = currentPoints + pointsEarned;

            return this.userService.updateUserPoints(currentUser.id!, newTotalPoints).pipe(
              switchMap(() => {
                return this.challengeService.completeChallenge(challengeId).pipe(
                  map(() => ({
                    success: true,
                    pointsEarned,
                    newTotalPoints,
                    challengeCompleted: true,
                    message: `¡Trivia completada! Has ganado ${pointsEarned} puntos`
                  })),
                  catchError(() => of({
                    success: true,
                    pointsEarned,
                    newTotalPoints,
                    challengeCompleted: false,
                    message: `Has ganado ${pointsEarned} puntos`
                  }))
                );
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error processing trivia result:', error);
        this.alertService.displayAlert('error', 'Error procesando resultado de trivia', 'center', 'top', ['error-snackbar']);
        return of({ success: false, error: error.message });
      })
    );
  }
}
