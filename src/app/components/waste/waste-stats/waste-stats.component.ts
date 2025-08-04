import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteService } from '../../../services/waste.service';
import { IWasteStats } from '../../../interfaces';

@Component({
  selector: 'app-waste-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waste-stats.component.html',
  styleUrls: ['./waste-stats.component.scss']
})
export class WasteStatsComponent implements OnInit {
  totalWaste = 0;
  plasticCount = 0;
  paperCount = 0;
  glassCount = 0;
  metalCount = 0;
  cardboardCount = 0;
  trashCount = 0;
  loading = true;

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    
    this.wasteService.getAllWaste(0, 1000).subscribe({
      next: (response: any) => {
        let wasteArray: any[] = [];
        
        if (response?.data && Array.isArray(response.data)) {
          wasteArray = response.data;
        } else if (response?.data?.content && Array.isArray(response.data.content)) {
          wasteArray = response.data.content;
        } else if (response && (response as any).content && Array.isArray((response as any).content)) {
          wasteArray = (response as any).content;
        }
        
        if (wasteArray.length > 0) {
          this.calculateStats(wasteArray);
        } else {
          this.totalWaste = 0;
          this.plasticCount = 0;
          this.paperCount = 0;
          this.glassCount = 0;
          this.metalCount = 0;
          this.cardboardCount = 0;
          this.trashCount = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.totalWaste = 0;
        this.plasticCount = 0;
        this.paperCount = 0;
        this.glassCount = 0;
        this.metalCount = 0;
        this.cardboardCount = 0;
        this.trashCount = 0;
        this.loading = false;
      }
    });
  }

  private calculateStats(wasteData: any[]): void {
    this.totalWaste = wasteData.length;
    this.plasticCount = wasteData.filter(w => w.productType === 'plastic').length;
    this.paperCount = wasteData.filter(w => w.productType === 'paper').length;
    this.glassCount = wasteData.filter(w => w.productType === 'glass').length;
    this.metalCount = wasteData.filter(w => w.productType === 'metal').length;
    this.cardboardCount = wasteData.filter(w => w.productType === 'cardboard').length;
    this.trashCount = wasteData.filter(w => w.productType === 'trash').length;
  }
}
