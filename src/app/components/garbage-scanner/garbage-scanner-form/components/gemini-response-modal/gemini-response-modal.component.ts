import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gemini-response-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gemini-response-modal.component.html',
  styleUrl: './gemini-response-modal.component.scss'
})
export class GeminiResponseModalComponent implements OnChanges, OnDestroy {
  @Input() isVisible = false;
  @Input() question = '';
  @Input() response = '';
  @Input() materialName = '';
  @Input() isLoading = false;
  @Output() onClose = new EventEmitter<void>();

  private keyboardListener?: (event: KeyboardEvent) => void;

  ngOnChanges(changes: SimpleChanges) {
    // Si el modal se cierra, limpiar cualquier listener
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.addKeyboardListener();
      } else {
        this.removeKeyboardListener();
      }
    }
  }

  ngOnDestroy() {
    this.removeKeyboardListener();
  }

  private addKeyboardListener() {
    this.keyboardListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal();
      }
    };
    document.addEventListener('keydown', this.keyboardListener);
  }

  private removeKeyboardListener() {
    if (this.keyboardListener) {
      document.removeEventListener('keydown', this.keyboardListener);
      this.keyboardListener = undefined;
    }
  }

  closeModal() {
    this.removeKeyboardListener();
    this.onClose.emit();
  }

  // Prevenir que el modal se cierre al hacer click en el contenido
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  // Obtener icono según el tipo de pregunta
  getQuestionIcon(): string {
    if (this.question.includes('¿Cómo se recicla?')) return 'fas fa-recycle';
    if (this.question.includes('Eco Opciones')) return 'fas fa-leaf';
    if (this.question.includes('¿Dónde va?')) return 'fas fa-map-marker-alt';
    return 'fas fa-comment-dots';
  }

  // Obtener color según el tipo de pregunta - Todo en verde
  getQuestionColor(): string {
    return 'text-success';
  }

  // Formatear la respuesta para mostrar párrafos separados
  formatResponse(response: string): string {
    if (!response) return '';
    
    // Dividir en párrafos y formatear
    const paragraphs = response.split('\n\n').filter(p => p.trim());
    
    return paragraphs
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('');
  }
}
