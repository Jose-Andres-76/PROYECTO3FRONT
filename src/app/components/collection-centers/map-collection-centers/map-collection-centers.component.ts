import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

// Configuración de íconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/icons/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/icons/leaflet/marker-icon.png',
  shadowUrl: 'assets/icons/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-map-collection-centers',
  standalone: true,
  templateUrl: './map-collection-centers.component.html',
  styleUrls: ['./map-collection-centers.component.scss']
})
export class MapCollectionCentersComponent implements OnInit {
  private map?: L.Map;

  private centers = [
    { name: 'Centro de Reciclaje Municipalidad de San José', lat: 9.9333, lng: -84.0833 },
    { name: 'Ministerio de Salud', lat: 9.9281, lng: -84.0907 },
    { name: 'Servicios Ecológicos', lat: 9.9345, lng: -84.0875 },
  ];

  ngOnInit(): void {
    requestAnimationFrame(() => {
      this.initMap();
      setTimeout(() => this.map?.invalidateSize(), 300);
    });
  }

    private initMap(): void {
    this.map = L.map('map').setView([9.9281, -84.0907], 12);

    this.map.whenReady(() => {
      setTimeout(() => this.map?.invalidateSize(), 200);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map!);

    this.centers.forEach(c =>
      L.marker([c.lat, c.lng])
        .addTo(this.map!)
        .bindPopup(`<b>${c.name}</b>`)
    );
  }
}
