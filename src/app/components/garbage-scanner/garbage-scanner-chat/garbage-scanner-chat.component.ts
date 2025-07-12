import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClasificacionBasuraService } from '../../../services/clasificacion-basura.service';

export interface PredefinedQuestion {
  id: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-garbage-scanner-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './garbage-scanner-chat.component.html',
  styleUrl: './garbage-scanner-chat.component.scss'
})
export class GarbageScannerChatComponent {
  @Input() currentResult: any = null;

  private clasificacionService = inject(ClasificacionBasuraService);

  public isLoading = false;
  public currentAnswer = '';

  public predefinedQuestions: PredefinedQuestion[] = [
    {
      id: 'how-to-recycle',
      label: '¿Cómo se recicla?',
      icon: 'fa-recycle',
      color: '#28a745'
    },
    {
      id: 'is-recyclable',
      label: 'Eco Opciones',
      icon: 'fa-leaf',
      color: '#20c997'
    },
    {
      id: 'where-dispose',
      label: '¿Dónde va?',
      icon: 'fa-map-marker-alt',
      color: '#fd7e14'
    }
  ];

  public askQuestion(question: PredefinedQuestion) {
    if (!this.currentResult || this.isLoading) return;

    this.isLoading = true;
    this.currentAnswer = '';

    const questionText = this.buildQuestionText(question.id);
    const producto = this.currentResult.clase || 'trash';

    this.clasificacionService.consultarGemini(producto, questionText).subscribe({
      next: (response) => {
        this.currentAnswer = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al consultar Gemini:', error);
        this.currentAnswer = this.getDefaultAnswer(question.id);
        this.isLoading = false;
      }
    });
  }

  private buildQuestionText(questionId: string): string {
    const questionMap: {[key: string]: string} = {
      'how-to-recycle': `¿Cómo se recicla correctamente este tipo de material? Dame instrucciones específicas paso a paso.`,
      'is-recyclable': `¿Qué opciones ecológicas y alternativas sostenibles existen para este material? Dame sugerencias para reducir su impacto ambiental, opciones de reutilización creativa, y alternativas más eco-friendly.`,
      'where-dispose': `¿En qué contenedor o lugar debo depositarlo? ¿Hay centros especiales de reciclaje para este material?`
    };
    
    return questionMap[questionId] || '¿Puedes darme información sobre este material?';
  }

  private getDefaultAnswer(questionId: string): string {
    if (!this.currentResult) return 'No hay información disponible.';

    const defaultAnswers: {[key: string]: string} = {
      'how-to-recycle': this.getDefaultRecyclingInstructions(),
      'is-recyclable': this.getDefaultEcoOptions(),
      'where-dispose': this.getDefaultDisposalInfo()
    };

    return defaultAnswers[questionId] || 'Información no disponible en este momento.';
  }

  private getDefaultRecyclingInstructions(): string {
    if (this.currentResult.es_reciclable) {
      return `<strong>Sí es reciclable.</strong><br><br>
              Pasos básicos:<br>
              1. Limpia el material<br>
              2. Separa diferentes componentes si es necesario<br>
              3. Deposita en el contenedor correspondiente<br><br>
              <em>Consulta las normas locales de reciclaje para obtener información específica.</em>`;
    } else {
      return `<strong>Este material no es reciclable.</strong><br><br>
              Debe ir en el contenedor de basura general.<br>
              Considera buscar alternativas reutilizables para el futuro.`;
    }
  }

  private getDefaultEcoOptions(): string {
    const className = this.currentResult.clase || 'trash';
    
    const ecoOptionsMap: {[key: string]: string} = {
      'paper': `<strong>Opciones Ecológicas para Papel:</strong><br><br>
                <strong>Reutilización:</strong> Usa el reverso para notas, dibujos o borradores<br>
                <strong>Manualidades:</strong> Crea origami, tarjetas o papel reciclado casero<br>
                <strong>Compostaje:</strong> El papel sin tinta puede compostarse<br>
                <strong>Alternativas:</strong> Usa documentos digitales, papel reciclado o bambú`,
      
      'cardboard': `<strong>Opciones Ecológicas para Cartón:</strong><br><br>
                   <strong>Reutilización:</strong> Cajas para almacenamiento, juguetes para niños<br>
                   <strong>Manualidades:</strong> Maquetas, organizadores, macetas biodegradables<br>
                   <strong>Compostaje:</strong> Se degrada naturalmente en compost<br>
                   <strong>Alternativas:</strong> Prefiere productos con menos empaque`,
      
      'plastic': `<strong>Opciones Ecológicas para Plástico:</strong><br><br>
                  <strong>Reutilización:</strong> Botellas como macetas, contenedores de almacenaje<br>
                  <strong>Upcycling:</strong> Transformar en organizadores, comederos para aves<br>
                  <strong>Alternativas:</strong> Bolsas reutilizables, botellas de vidrio/acero<br>
                  <strong>Reducir:</strong> Evita plásticos de un solo uso`,
      
      'glass': `<strong>Opciones Ecológicas para Vidrio:</strong><br><br>
                <strong>Reutilización:</strong> Frascos para almacenar, vasos, jarrones<br>
                <strong>Manualidades:</strong> Velas caseras, lámparas, decoración<br>
                <strong>Reciclaje infinito:</strong> El vidrio se recicla al 100% indefinidamente<br>
                <strong>Alternativas:</strong> Prefiere envases retornables`,
      
      'metal': `<strong>Opciones Ecológicas para Metal:</strong><br><br>
                <strong>Reutilización:</strong> Latas como macetas, organizadores, comederos<br>
                <strong>Manualidades:</strong> Instrumentos musicales, lámparas, arte<br>
                <strong>Alto valor:</strong> El metal mantiene propiedades al reciclarse<br>
                <strong>Alternativas:</strong> Productos duraderos, reparar en lugar de desechar`,
      
      'trash': `<strong>Opciones Ecológicas Generales:</strong><br><br>
                <strong>Reutilizar:</strong> Encuentra nuevos usos antes de desechar<br>
                <strong>Reparar:</strong> Arregla en lugar de reemplazar<br>
                <strong>Donar:</strong> Si está en buen estado, dónalo<br>
                <strong>Reducir:</strong> Consume menos, elige productos duraderos`
    };

    return ecoOptionsMap[className] || `<strong>Opciones Ecológicas:</strong><br><br>
            Busca formas de reutilizar este material<br>
            Investiga centros de reciclaje especializados<br>
            Considera alternativas más sostenibles para el futuro<br>
            Reduce el consumo de materiales similares`;
  }

  private getDefaultDisposalInfo(): string {
    const className = this.currentResult.clase || 'trash';
    
    const disposalMap: {[key: string]: string} = {
      'paper': 'Contenedor azul para papel y cartón',
      'cardboard': 'Contenedor azul para papel y cartón', 
      'plastic': 'Contenedor amarillo para plásticos',
      'glass': 'Contenedor verde para vidrio',
      'metal': 'Contenedor amarillo o punto limpio para metales',
      'trash': 'Contenedor gris para basura general'
    };

    const container = disposalMap[className] || 'Contenedor gris para basura general';
    
    return `<strong>Deposita en:</strong> ${container}<br><br>
            <em>Las normas pueden variar según tu localidad. 
            Consulta con tu ayuntamiento para información específica.</em>`;
  }

  public formatAnswer(answer: string): string {
    return answer.replace(/\n/g, '<br>');
  }
}
