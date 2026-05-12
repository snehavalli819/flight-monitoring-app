import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule }
from '@angular/common';
import { RouterModule } from '@angular/router';



import { MatCardModule }
from '@angular/material/card';

import { MatButtonModule }
from '@angular/material/button';

import { MatIconModule }
from '@angular/material/icon';

import { MatChipsModule }
from '@angular/material/chips';

import { MatMenuModule }
from '@angular/material/menu';

import { IncidentService, Incident } from '../../services/incident.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector:
    'app-incident-history',

  standalone: true,

  imports: [
    CommonModule,

    MatCardModule,

    MatButtonModule,

    MatIconModule,

    MatChipsModule,

    MatMenuModule,
  RouterModule,
  ],

  templateUrl:
    './incident-history.component.html',

  styleUrls: [
    './incident-history.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class IncidentHistoryComponent {

  private incidentService =
    inject(IncidentService);

  authService =
    inject(AuthService);

  incidents =
    this.incidentService
      .incidents;

  selectedSeverity =
    signal('ALL');

  filteredIncidents =
    computed(() => {

      if (
        this.selectedSeverity() ===
        'ALL'
      ) {

        return this.incidents();
      }

      return this.incidents().filter(
        (incident) =>

          incident.severity ===
          this.selectedSeverity()
      );
    });

  // STATUS

  updateStatus(
    incident: Incident,

    status:
      | 'Open'
      | 'In Progress'
      | 'Resolved'
  ): void {

    this.incidentService
      .updateIncidentStatus(
        incident.id,
        status
      );
  }

  // DELETE

  deleteIncident(
    incident: Incident
  ): void {

    this.incidentService
      .deleteIncident(
        incident.id
      );
  }

  // FILTER

  setSeverity(
    severity: string
  ): void {

    this.selectedSeverity.set(
      severity
    );
  }

  // STYLES

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
        return '';
    }
  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Open':
        return 'status-open';

      case 'In Progress':
        return 'status-progress';

      case 'Resolved':
        return 'status-resolved';

      default:
        return '';
    }
  }

  trackByIncidentId = (
    _: number,
    item: Incident
  ) => item.id;
}