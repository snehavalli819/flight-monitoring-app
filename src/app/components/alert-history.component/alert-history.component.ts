import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';


import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AlertService, FlightAlert } from '../../services/alerts.service';

@Component({
  selector: 'app-alert-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
  ],
  templateUrl:
    './alert-history.component.html',

  styleUrls: [
    './alert-history.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AlertHistoryComponent {

  private alertService =
    inject(AlertService);

  alerts =
    this.alertService.alerts;

  selectedSeverity =
    signal('ALL');

  filteredAlerts = computed(() => {

    if (
      this.selectedSeverity() ===
      'ALL'
    ) {
      return this.alerts();
    }

    return this.alerts().filter(
      (alert) =>
        alert.severity ===
        this.selectedSeverity()
    );
  });

  setSeverityFilter(
    severity: string
  ): void {

    this.selectedSeverity.set(
      severity
    );
  }

  getSeverityClass(
    severity: string
  ): string {

    switch (severity) {

      case 'HIGH':
        return 'severity-high';

      case 'MEDIUM':
        return 'severity-medium';

      case 'LOW':
        return 'severity-low';

      default:
        return 'severity-low';
    }
  }

  trackByAlertId = (
    _: number,
    item: FlightAlert
  ) => item.id;
}