import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scanner-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scanner-tabs.component.html',
  styleUrl: './scanner-tabs.component.scss'
})
export class ScannerTabsComponent {
  @Input() activeTab: 'upload' | 'camera' | 'chat' = 'upload';
  @Input() isAnalyzing: boolean = false;
  @Input() hasResult: boolean = false;
  @Output() tabChanged = new EventEmitter<'upload' | 'camera' | 'chat'>();

  selectTab(tab: 'upload' | 'camera' | 'chat') {
    this.tabChanged.emit(tab);
  }
}
