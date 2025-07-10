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
  provinces = ['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'];
  selectedProvince = '';
  
   allCenters = [
  // San José
  { 
    name: 'Centro de Reciclaje Municipalidad de San José', 
    lat: 9.9333, lng: -84.0833, province: 'San José', 
    address: 'Hatillo 2, Avenida Central' 
  },
  { 
    name: 'Ministerio de Salud', 
    lat: 9.9281, lng: -84.0907, province: 'San José', 
    address: 'Calle 16, Av. 6-8, Barrio Hospital, San José centro' 
  },
  { 
    name: 'Servicios Ecológicos', 
    lat: 9.9345, lng: -84.0875, province: 'San José', 
    address: 'Río Oro, Santa Ana, 300 m oeste de la Cruz Roja (carretera a Piedades)' 
  },
  { 
    name: 'Centro de Acopio Preserve Planet', 
    lat: 9.881438821316081, lng: -84.08018299677622, province: 'San José', 
    address: 'Urbanización El Rosario, Desamparados' 
  },
  { 
    name: 'Recicladora San Miguel', 
    lat: 9.898957612168795, lng: -84.09330938763878, province: 'San José', 
    address: 'Concepción Abajo de Alajuelita' 
  },
  { 
    name: 'Reciclaje El poder', 
    lat: 9.90884370731498, lng: -84.09875597929738, province: 'San José', 
    address: 'Ciudadela 15 de Setiembre, Hatillo' 
  },
  { 
    name: 'Recicladora La Calma, SA San José, Centro', 
    lat: 9.9246469290034, lng: -84.08397518763879, province: 'San José', 
    address: 'Barrio Cristo Rey, Av 22 y Calle 12, San José' 
  },
  { 
    name: 'RPI (Recycling Plastic Industries)', 
    lat: 9.919127, lng: -84.098399, province: 'San José', 
    address: 'Hatillo, San José' 
  },
  { 
    name: 'ZUBRE SA', 
    lat: 9.916302666912715, lng: -84.08191504901258, province: 'San José', 
    address: 'San Sebastián, 200 m oeste de Motel Maison Doré (Paso Ancho)' 
  },
  { 
    name: 'Recicladora IMSA', 
    lat: 9.916316841138467, lng: -84.08165041832567, province: 'San José', 
    address: 'Paso Ancho, San Sebastián, 150 m oeste de Motel Maison Doré' 
  },
  { 
    name: 'Recicladora Costarricense de Metales SA', 
    lat: 9.922363883875432, lng: -84.06251973366906, province: 'San José', 
    address: 'Barrio Córdoba, Zapote, 100 m Este de Autos Bohío' 
  },
  { 
    name: 'Capri Recycling Center', 
    lat: 9.937492470350909, lng: -84.04681543792871, province: 'San José', 
    address: 'San Pedro de Montes de Oca, 100 m E y 150 m N de la Iglesia Católica' 
  },
  { 
    name: 'Recicladora paso de la vaca', 
    lat: 9.93912864647815, lng: -84.08095732996696, province: 'San José', 
    address: 'Paso de la Vaca, San José centro' 
  },
  { 
    name: 'SyR Reciclaje Global S.A.', 
    lat: 9.925948477286886, lng: -84.0937233606539, province: 'San José', 
    address: 'Hatillo, San José' 
  },
  { 
    name: 'Centro de Acopio y Reciclaje, San Antonio de Escazú', 
    lat: 9.90101190920809, lng: -84.13104379134087, province: 'San José', 
    address: 'San Antonio de Escazú, Escazú' 
  },
  { 
    name: 'Recicladora Capri', 
    lat: 9.937647551044789, lng: -84.04691049319176, province: 'San José', 
    address: 'San Pedro de Montes de Oca, 100 m E y 150 m N de la Iglesia Católica' 
  },
  { 
    name: 'Centro de recepción de reciclaje PROGEA de Costa Rica', 
    lat: 9.951773336053126, lng: -84.05308275880269, province: 'San José', 
    address: 'Santa Cecilia, Calle Lizano, San Antonio de Guadalupe' 
  },
  { 
    name: 'Centro de acopio calle 12', 
    lat: 9.938523846869684, lng: -84.08405815880285, province: 'San José', 
    address: 'Calle 12, Merced, San José centro' 
  },

  // Cartago
  { 
    name: 'HC Recycle', 
    lat: 9.844667145090039, lng: -83.95770200298266, province: 'Cartago', 
    address: 'Cartago (pending exact addresss)' 
  },

  // Limón
  { 
    name: 'Municipalidad de Limón', 
    lat: 9.99074, lng: -83.03596, province: 'Limón', 
    address: 'Limón centro ' 
  },
  { 
    name: 'Municipalidad de Pococí', 
    lat: 10.5028, lng: -83.6475, province: 'Limón', 
    address: 'Guápiles, Pococí' 
  }, 
  { 
    name: 'Municipalidad de Matina', 
    lat: 10.2100, lng: -83.6300, province: 'Limón', 
    address: 'Matina centro' 
  },
  { 
    name: 'Reciplanethch S.A.', 
    lat: 10.0000, lng: -83.5000, province: 'Limón', 
    address: 'Limón' 
  },

  // Heredia
  { 
    name: 'Municipalidad de Heredia', 
    lat: 10.0025, lng: -84.1160, province: 'Heredia', 
    address: 'Heredia centro)' 
  },
  { 
    name: 'Municipalidad de San Rafael de Heredia', 
    lat: 9.9950, lng: -84.1160, province: 'Heredia', 
    address: 'San Rafael de Heredia centro' 
  },
  { 
    name: 'Municipalidad San Pablo de Heredia', 
    lat: 10.0140, lng: -84.1160, province: 'Heredia', 
    address: 'San Pablo de Heredia centro' 
  },
  { 
    name: 'Centro de Acopio Municipalidad de Sarapiquí', 
    lat: 10.4333, lng: -84.0333, province: 'Heredia', 
    address: 'Puerto Viejo, Sarapiquí' 
  },

  // Alajuela
  { 
    name: 'Municipalidad de Alajuela', 
    lat: 10.0167, lng: -84.2167, province: 'Alajuela', 
    address: 'Alajuela centro' 
  },
  { 
    name: 'Municipalidad de Río Cuarto', 
    lat: 10.2333, lng: -84.3333, province: 'Alajuela', 
    address: 'Río Cuarto centro ' 
  },
  { 
    name: 'Multiservicios Ecológicos', 
    lat: 10.1000, lng: -84.2500, province: 'Alajuela', 
    address: 'Grecia' 
  },
  { 
    name: 'Municipalidad de Orotina', 
    lat: 9.9500, lng: -84.4500, province: 'Alajuela', 
    address: 'Orotina centro ' 
  },
  { 
    name: 'Municipalidad de San Mateo', 
    lat: 9.9500, lng: -84.1167, province: 'Alajuela', 
    address: 'San Mateo centro' 
  },

  // Guanacaste
  { 
    name: 'Municipalidad de Guanacaste', 
    lat: 10.5167, lng: -85.1667, province: 'Guanacaste', 
    address: 'Liberia, Guanacaste ' 
  },
  { 
    name: 'Reciclaje Manrique Soto', 
    lat: 10.4000, lng: -85.5833, province: 'Guanacaste', 
    address: 'Nicoya' 
  },
  { 
    name: 'Municipalidad de Bagaces', 
    lat: 10.3333, lng: -85.3667, province: 'Guanacaste', 
    address: 'Bagaces centro ' 
  },
  { 
    name: 'Municipalidad de Cañas', 
    lat: 10.3333, lng: -85.1500, province: 'Guanacaste', 
    address: 'Cañas centro' 
  },

  // Cartago
  { 
    name: 'Municipalidad de Cartago', 
    lat: 9.8590, lng: -83.9190, province: 'Cartago', 
    address: 'Cartago centro' 
  },
  { 
    name: 'Municipalidad de La Unión', 
    lat: 9.8570, lng: -83.8500, province: 'Cartago', 
    address: 'Tres Ríos, La Unión' 
  },
  { 
    name: 'Gestión Integral de residuos de Lourdes', 
    lat: 9.8500, lng: -83.9300, province: 'Cartago', 
    address: 'Lourdes de Cartago' 
  },
  { 
    name: 'Municipalidad Paraíso', 
    lat: 9.8500, lng: -83.9200, province: 'Cartago', 
    address: 'Paraíso centro' 
  },
      
  // Puntarenas
  { 
    name: 'Municipalidad de Puntarenas', 
    lat: 9.9763, lng: -84.8381, province: 'Puntarenas', 
    address: 'Puntarenas centro' 
  },
  { 
    name: 'Municipalidad de Corredores', 
    lat: 8.5380, lng: -82.8506, province: 'Puntarenas', 
    address: 'Ciudad Neily, Corredores' 
  },
  { 
    name: 'Municipalidad de Osa', 
    lat: 8.9562, lng: -83.4816, province: 'Puntarenas', 
    address: 'Ciudad Cortés, Osa' 
  },
  { 
    name: 'Municipalidad de Parrita', 
    lat: 9.5206, lng: -84.3243, province: 'Puntarenas', 
    address: 'Parrita centro' 
  }
];

  get filteredCenters() {
    return this.selectedProvince
      ? this.allCenters.filter(c => c.province === this.selectedProvince)
      : [];
  }
}
