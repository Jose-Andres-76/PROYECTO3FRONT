import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  private http = inject(HttpClient);

  public sendRecoveryCode(email: string): Observable<any> {
    return this.http.post('auth/recovery/send-code', { email }, { 
      responseType: 'text' as 'json' 
    });
  }

  public validateCode(email: string, code: string): Observable<any> {
    return this.http.post('auth/recovery/validate-code', { 
      email, 
      code 
    }, { 
      responseType: 'text' as 'json' 
    });
  }

  public resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post('auth/recovery/reset-password', {
      email,
      code,
      newPassword
    }, { 
      responseType: 'text' as 'json' 
    });
  }
}