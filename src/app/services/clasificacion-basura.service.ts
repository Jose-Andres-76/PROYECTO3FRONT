import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ClasificacionResponse {
  clase: string;
  confianza: number;
  es_reciclable: boolean;
  mensaje: string;
}

export interface GeminiResponse {
  respuesta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClasificacionBasuraService {
  private http = inject(HttpClient);

  public clasificarBasura(file: File): Observable<ClasificacionResponse> {
    console.log('Iniciando clasificación de basura...');
    console.log('Archivo:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type);
    
    const formData = new FormData();
    formData.append('file', file);

    const url = 'clasificacion/clasificar-basura';

    return this.http.post<ClasificacionResponse>(url, formData)
      .pipe(
        tap(response => {
          console.log('Clasificación exitosa:', response);
        }),
        catchError(this.handleError<ClasificacionResponse>('clasificarBasura'))
      );
  }

  public consultarGemini(producto: string, mensaje: string): Observable<any> {
    console.log('Consultando Gemini...');
    console.log('Producto:', producto, 'Mensaje:', mensaje);
    
    const params = new URLSearchParams();
    params.append('product', producto);
    params.append('message', mensaje);
    const url = 'gemini/chat';

    const request = this.http.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'text' as 'text'
    });

    return request.pipe(
      tap(response => {
        console.log('Respuesta de Gemini recibida:', response);
      }),
      catchError(this.handleError('consultarGemini'))
    );
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`Error en ${operation}:`, error);
      
      let errorMessage = 'Error desconocido';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error de cliente: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
            break;
          case 400:
            errorMessage = 'Solicitud inválida. Verifica el formato de la imagen.';
            break;
          case 404:
            errorMessage = 'Servicio no encontrado. Verifica la URL del backend.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Revisa los logs del backend.';
            break;
          default:
            errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
        }
      }
      
      console.error('Detalles del error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: errorMessage
      });
      
      return throwError(() => new Error(errorMessage));
    };
  }
}
