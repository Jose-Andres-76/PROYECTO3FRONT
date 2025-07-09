import { Component } from '@angular/core';
import { MapCollectionCentersComponent } from '../../components/collection-centers/map-collection-centers/map-collection-centers.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-centers',
  standalone: true,
  imports: [CommonModule, FormsModule, MapCollectionCentersComponent],
  templateUrl: './collection-centers.component.html',
  styleUrl: './collection-centers.component.scss'
})
export class CollectionCentersComponent {
  provincias = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];
  selectedProvincia = '';
  
  allCenters = [
    // San José
    { name: 'Centro de Reciclaje Municipalidad de San José', lat: 9.9333, lng: -84.0833, provincia: 'San José' },
    { name: 'Ministerio de Salud', lat: 9.9281, lng: -84.0907, provincia: 'San José' },
    { name: 'Servicios Ecológicos', lat: 9.9345, lng: -84.0875, provincia: 'San José' },
    { name: 'Centro de Acopio Preserve Planet', lat: 9.881438821316081, lng: -84.08018299677622, provincia: 'San José' },
    { name: 'Recicladora San Miguel', lat: 9.898957612168795, lng: -84.09330938763878, provincia: 'San José' },
    { name: 'Reciclaje El poder', lat: 9.90884370731498, lng: -84.09875597929738, provincia: 'San José' },
    { name: 'Recicladora La Calma, SA San José, Centro', lat: 9.9246469290034, lng: -84.08397518763879, provincia: 'San José' },
    { name: 'RPI (Recycling Plastic Industries)', lat: 9.919127, lng: -84.098399, provincia: 'San José' },
    { name: 'ZUBRE SA', lat: 9.916302666912715, lng: -84.08191504901258, provincia: 'San José' },
    { name: 'Recicladora IMSA', lat: 9.916316841138467, lng: -84.08165041832567, provincia: 'San José' },
    { name: 'Recicladora Costarricense de Metales SA', lat: 9.922363883875432, lng: -84.06251973366906, provincia: 'San José' },
    { name: 'Capri Recycling Center', lat: 9.937492470350909, lng: -84.04681543792871, provincia: 'San José' },
    { name: 'Recicladora paso de la vaca', lat: 9.93912864647815, lng: -84.08095732996696, provincia: 'San José' },
    { name: 'REx LOGISTICA DE RECICLAJE', lat: 9.916051, lng: -84.088893, provincia: 'San José' },
    { name: 'SyR Reciclaje Global S.A.', lat: 9.925948477286886, lng: -84.0937233606539, provincia: 'San José' },
    { name: 'Centro de Acopio y Reciclaje, San Antonio de Escazú', lat: 9.90101190920809, lng: -84.13104379134087, provincia: 'San José' },
    { name: 'Recicladora Capri', lat: 9.937647551044789, lng: -84.04691049319176, provincia: 'San José' },
    { name: 'Desechos electrónicos Costa Rica', lat: 9.939518, lng: -84.063452, provincia: 'San José' },
    { name: 'Centro de recepción de reciclaje PROGEA de Costa Rica', lat: 9.951773336053126, lng: -84.05308275880269, provincia: 'San José' },
    { name: 'Centro de acopio calle 12', lat: 9.938523846869684, lng: -84.08405815880285, provincia: 'San José' },

    // Cartago
    { name: 'HC Recycle', lat: 9.844667145090039, lng: -83.95770200298266, provincia: 'Cartago' },

    // Limón
    { name: 'Municipalidad de Limón', lat: 9.99074, lng: -83.03596, provincia: 'Limón' },
    { name: 'Municipalidad de Pococí', lat: 10.5028, lng: -83.6475, provincia: 'Limón' }, 
    { name: 'Municipalidad de Matina', lat: 10.2100, lng: -83.6300, provincia: 'Limón' },
    { name: 'Reciplanethch S.A.', lat: 10.0000, lng: -83.5000, provincia: 'Limón' },

    // Heredia
    { name: 'Municipalidad de Heredia', lat: 10.0025, lng: -84.1160, provincia: 'Heredia' },
    { name: 'Municipalidad de San Rafael de Heredia', lat: 9.9950, lng: -84.1160, provincia: 'Heredia' },
    { name: 'Municipalidad San Pablo de Heredia', lat: 10.0140, lng: -84.1160, provincia: 'Heredia' },
    { name: 'Centro de Acopio Municipalidad de Sarapiquí', lat: 10.4333, lng: -84.0333, provincia: 'Heredia' },

    // Alajuela
    { name: 'Municipalidad de Alajuela', lat: 10.0167, lng: -84.2167, provincia: 'Alajuela' },
    { name: 'Municipalidad de Río Cuarto', lat: 10.2333, lng: -84.3333, provincia: 'Alajuela' },
    { name: 'Multiservicios Ecológicos', lat: 10.1000, lng: -84.2500, provincia: 'Alajuela' },
    { name: 'Municipalidad de Orotina', lat: 9.9500, lng: -84.4500, provincia: 'Alajuela' },
    { name: 'Municipalidad de San Mateo', lat: 9.9500, lng: -84.1167, provincia: 'Alajuela' },

    // Guanacaste
    { name: 'Municipalidad de Guanacaste', lat: 10.5167, lng: -85.1667, provincia: 'Guanacaste' },
    { name: 'Reciclaje Manrique Soto', lat: 10.4000, lng: -85.5833, provincia: 'Guanacaste' },
    { name: 'Municipalidad de Bagaces', lat: 10.3333, lng: -85.3667, provincia: 'Guanacaste' },
    { name: 'Municipalidad de Cañas', lat: 10.3333, lng: -85.1500, provincia: 'Guanacaste' },

    // Cartago
    { name: 'Municipalidad de Cartago', lat: 9.8590, lng: -83.9190, provincia: 'Cartago' },
    { name: 'Municipalidad de La Unión', lat: 9.8570, lng: -83.8500, provincia: 'Cartago' },
    { name: 'Gestión Integral de residuos de Lourdes', lat: 9.8500, lng: -83.9300, provincia: 'Cartago' },
    { name: 'Municipalidad Paraíso', lat: 9.8500, lng: -83.9200, provincia: 'Cartago' },
      
    // Puntarenas
    { name: 'Municipalidad de Puntarenas', lat: 9.9763, lng: -84.8381, provincia: 'Puntarenas' },
    { name: 'Municipalidad de Corredores', lat: 8.5380, lng: -82.8506, provincia: 'Puntarenas' },
    { name: 'Municipalidad de Osa', lat: 8.9562, lng: -83.4816, provincia: 'Puntarenas' },
    { name: 'Municipalidad de Parrita', lat: 9.5206, lng: -84.3243, provincia: 'Puntarenas' },

  ];



  get filteredCenters() {
    return this.selectedProvincia
      ? this.allCenters.filter(c => c.provincia === this.selectedProvincia)
      : [];
  }
}
