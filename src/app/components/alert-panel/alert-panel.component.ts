import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';



import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { AlertService, FlightAlert } from '../../services/alerts.service';

@Component({
  selector: 'app-alerts-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatBadgeModule,
  ],
  templateUrl: './alert-panel.component.html',

  styleUrls: ['./alert-panel.component.scss'],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AlertPanelComponent {

  private alertService =
    inject(AlertService);

  alerts =
    this.alertService.alerts;

  alertCount =
    this.alertService.alertCount;

  criticalAlerts = computed(() =>

    this.alerts().filter(
      (alert) =>
        alert.severity === 'HIGH'
    )
  );

  constructor() {

    // MOCK ALERTS

    this.generateMockAlerts();
  }

  generateMockAlerts(): void {

    this.alertService.generateAlert({
      flightId: 'AI102',

      type: 'ALTITUDE_DROP',

      severity: 'HIGH',

      message:
        'Sudden altitude drop detected.',
    });

    this.alertService.generateAlert({
      flightId: 'UK221',

      type: 'SPEED_EXCEEDED',

      severity: 'MEDIUM',

      message:
        'Speed threshold exceeded.',
    });

    this.alertService.generateAlert({
      flightId: '6E990',

      type: 'DELAY',

      severity: 'LOW',

      message:
        'Flight delayed more than 30 mins.',
    });
  }

  getAlertClass(
    severity: string
  ): string {

    switch (severity) {

      case 'HIGH':
        return 'high-alert';

      case 'MEDIUM':
        return 'medium-alert';

      case 'LOW':
        return 'low-alert';

      default:
        return 'low-alert';
    }
  }

  getAlertIcon(
    type: string
  ): string {

    switch (type) {

      case 'ALTITUDE_DROP':
        return 'trending_down';

      case 'SPEED_EXCEEDED':
        return 'speed';

      case 'DELAY':
        return 'schedule';

      default:
        return 'warning';
    }
  }

  markAsRead(alert: FlightAlert): void {

    this.alertService.markAsRead(
      alert.id
    );
  }

  clearAlert(id: number): void {

    this.alertService.clearAlert(id);
  }

  clearAll(): void {

    this.alertService.clearAll();
  }

  trackByAlertId = (
    _: number,
    item: FlightAlert
  ) => item.id;
}