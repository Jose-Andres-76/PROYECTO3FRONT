import { Component, Input, Output, EventEmitter, inject, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasificacionResponse, ClasificacionBasuraService } from '../../../../../services/clasificacion-basura.service';
import { AlertService } from '../../../../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analyzed-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyzed-result.component.html',
  styleUrl: './analyzed-result.component.scss'
})
export class AnalyzedResultComponent implements OnDestroy, OnChanges {
  @Input() imageSrc: string | null = null;
  @Input() analysisResult: ClasificacionResponse | null = null;
  @Output() scanNewRequested = new EventEmitter<void>();

  private clasificacionService = inject(ClasificacionBasuraService);
  private alertService = inject(AlertService);
  private geminiSubscription: Subscription | null = null;

  showResponse = false;
  currentQuestion = '';
  currentResponse = '';
  isLoadingResponse = false;

  mainQuestions = [
    "¿Cómo se recicla?",
    "Eco Opciones", 
    "¿Dónde va?"
  ];

  additionalQuestions = [
    "¿Cómo debo limpiar este material antes de reciclarlo?",
    "¿En qué contenedor debo depositar este residuo?",
    "¿Qué partes de este producto son reciclables?",
    "¿Hay alguna preparación especial necesaria?",
    "¿Dónde puedo llevarlo si no es reciclable en casa?"
  ];

  scanNew() {
    this.scanNewRequested.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['analysisResult'] || changes['imageSrc']) {
      this.closeModalAndReset();
    }
  }

  ngOnDestroy() {
    this.closeModalAndReset();
  }

  private closeModalAndReset() {
    if (this.geminiSubscription) {
      this.geminiSubscription.unsubscribe();
      this.geminiSubscription = null;
    }
    
    this.showResponse = false;
    this.currentQuestion = '';
    this.currentResponse = '';
    this.isLoadingResponse = false;
  }

  onQuestionClick(question: string) {
    if (!this.analysisResult) {
      this.alertService.displayAlert('warning', 'No hay resultados de análisis disponibles');
      return;
    }

    if (this.geminiSubscription) {
      this.geminiSubscription.unsubscribe();
    }

    this.currentQuestion = question;
    this.currentResponse = '';
    this.isLoadingResponse = true;
    this.showResponse = true;

    const materialName = this.getTranslatedMaterialName();
    
    let geminiMessage = '';
    switch (question) {
      case '¿Cómo se recicla?':
        geminiMessage = `¿Cómo se recicla correctamente ${materialName}? Dame instrucciones paso a paso.`;
        break;
      case 'Eco Opciones':
        geminiMessage = `¿Qué alternativas ecológicas existen para ${materialName}? ¿Cómo puedo reducir su uso?`;
        break;
      case '¿Dónde va?':
        geminiMessage = `¿En qué contenedor específico debo depositar ${materialName}? ¿Hay centros de reciclaje especializados?`;
        break;
      default:
        geminiMessage = `${question} Para el material: ${materialName}`;
    }

    this.geminiSubscription = this.clasificacionService.consultarGemini(materialName, geminiMessage).subscribe({
      next: (response) => {
        console.log('Respuesta de Gemini:', response);
        if (this.showResponse && this.currentQuestion === question) {
          this.currentResponse = response || 'No se recibió respuesta del asistente.';
          this.isLoadingResponse = false;
        }
      },
      error: (error) => {
        console.error('Error consultando Gemini:', error);
        if (this.showResponse && this.currentQuestion === question) {
          this.currentResponse = 'Error al consultar con el asistente IA. Por favor, intenta nuevamente.';
          this.isLoadingResponse = false;
        }
      }
    });
  }

  onCloseResponse() {
    this.closeModalAndReset();
  }

  getMaterialIcon(): string {
    if (!this.analysisResult) return 'fas fa-recycle';
    
    const clase = this.analysisResult.clase.toLowerCase();
    if (clase.includes('vidrio') || clase.includes('glass')) return 'fas fa-wine-bottle';
    if (clase.includes('papel') || clase.includes('paper') || clase.includes('cartón') || clase.includes('cardboard')) return 'fas fa-newspaper';
    if (clase.includes('plástico') || clase.includes('plastic')) return 'fas fa-cube';
    if (clase.includes('metal') || clase.includes('lata') || clase.includes('can')) return 'fas fa-can-food';
    if (clase.includes('orgánico') || clase.includes('compost') || clase.includes('organic')) return 'fas fa-seedling';
    return 'fas fa-recycle';
  }

  getTranslatedMaterialName(): string {
    if (!this.analysisResult) return '';
    
    const clase = this.analysisResult.clase.toLowerCase();
    const translations: { [key: string]: string } = {
      'glass': 'Vidrio',
      'paper': 'Papel',
      'plastic': 'Plástico',
      'metal': 'Metal',
      'cardboard': 'Cartón',
      'organic': 'Orgánico',
      'can': 'Lata',
      'trash': 'Basura',
      'garbage': 'Basura',
      'waste': 'Residuo',
      'bottle': 'Botella',
      'bag': 'Bolsa'
    };
    
    for (const [english, spanish] of Object.entries(translations)) {
      if (clase === english) {
        return spanish;
      }
    }
    
    for (const [english, spanish] of Object.entries(translations)) {
      if (clase.includes(english)) {
        return spanish;
      }
    }
    
    return this.analysisResult.clase.charAt(0).toUpperCase() + this.analysisResult.clase.slice(1);
  }

  getStatusColor(): string {
    return this.analysisResult?.es_reciclable ? 'text-success' : 'text-warning';
  }

  getStatusText(): string {
    return this.analysisResult?.es_reciclable ? 'Reciclable' : 'No Reciclable';
  }
}
