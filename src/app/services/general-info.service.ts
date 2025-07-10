
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {
  private http = inject(HttpClient);

  public sendEmailGeneralInfo(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = { email };

    return this.http.post('auth/generalInfo', body, { 
      headers,
      observe: 'response'
    }).pipe(
      catchError(error => {
        console.error('Service error:', error);
        
        // Handle specific error cases
        if (error.status === 404) {
          console.error('Endpoint not found - check if backend is running');
        } else if (error.status === 400) {
          console.error('Bad request - check email format');
        } else if (error.status === 0) {
          console.error('Network error - check if backend is accessible');
        }
        
        return throwError(() => error);
      })
    );
  }
}
