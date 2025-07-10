import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClasificacionBasuraService } from './clasificacion-basura.service';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiChatService {
  private clasificacionService = inject(ClasificacionBasuraService);

  public sendMessage(mensaje: string): Observable<string> {
    return this.clasificacionService.consultarGemini('', mensaje);
  }

  public generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
