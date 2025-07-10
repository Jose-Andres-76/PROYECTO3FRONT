import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

// Configuración de íconos Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/icons/leaflet/marker-icon-2x.png',
  iconUrl: '/assets/icons/leaflet/marker-icon.png',
  shadowUrl: '/assets/icons/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-map-collection-centers',
  standalone: true,
  templateUrl: './map-collection-centers.component.html',
  styleUrls: ['./map-collection-centers.component.scss']
})
export class MapCollectionCentersComponent implements OnInit {
  private map?: L.Map;

  @Input() centers: { name: string; lat: number; lng: number; province: string; address: string }[] = [];

  ngOnInit(): void {
    requestAnimationFrame(() => {
      this.initMap();
      setTimeout(() => this.map?.invalidateSize(), 300);
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([9.9281, -84.0907], 8);

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
