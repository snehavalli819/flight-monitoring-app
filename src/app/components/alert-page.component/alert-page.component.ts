import { Component } from '@angular/core';
import { AlertPanelComponent } from '../alert-panel/alert-panel.component';
import { AlertHistoryComponent } from '../alert-history.component/alert-history.component';

@Component({
  selector: 'app-alert-page.component',
  imports: [AlertPanelComponent,AlertHistoryComponent],
  standalone: true,
  templateUrl: './alert-page.component.html',
  styleUrls: ['./alert-page.component.scss'],
})
export class AlertPageComponent {}
