import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})

export class AlertService {
  private snackBar = inject(MatSnackBar);
  displayAlert(type: string, message: string, horizontalPosition?: MatSnackBarHorizontalPosition, verticalPosition?: MatSnackBarVerticalPosition, panelClass?: string[]) {
    let finalMessage = !message && type == 'error' ? 'An error occurred, please try again later' : !message && type == 'success' ? 'Success' : message;
    
    let cssClass = ['error-snackbar'];
    if (type === 'success') {
      cssClass = ['success-snackbar'];
    } else if (type === 'error') {
      cssClass = ['error-snackbar'];
    }
    
    this.snackBar.open(finalMessage, 'Cerrar', {
      horizontalPosition: horizontalPosition ?? 'center',
      verticalPosition: verticalPosition ?? 'top',
      panelClass: panelClass ?? cssClass,
      duration: 3000
    });
  }

}