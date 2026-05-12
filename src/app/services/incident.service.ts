import {
  Injectable,
  computed,
  signal,
} from '@angular/core';

import { HttpClient }
from '@angular/common/http';

export interface Incident {

  id: number;

  flightId: string;

  incidentType: string;

  severity:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

  description: string;

  timestamp: string;

  assignedTeam?: string;

  communicationFrequency?: string;

  lastCommunicationTime?: string;

  reportedBy?: string;

  status:
    | 'Open'
    | 'In Progress'
    | 'Resolved';
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {

  private STORAGE_KEY =
    'flight-incidents';

  // STATE

  incidents =
    signal<Incident[]>([]);

  selectedIncident =
    signal<Incident | null>(null);

  // COMPUTED

  totalIncidents =
    computed(() =>

      this.incidents().length
    );

  openIncidents =
    computed(() =>

      this.incidents().filter(
        (incident) =>
          incident.status ===
          'Open'
      )
    );

  highSeverityIncidents =
    computed(() =>

      this.incidents().filter(
        (incident) =>
          incident.severity ===
          'HIGH'
      )
    );

  constructor(
    private http: HttpClient
  ) {

  this.loadIncidents();
  }

  // LOAD INCIDENTS

  loadIncidents(): void {

    // Try to load incidents from history.state first (browser only)
    try {
      if (
        typeof window !== 'undefined' &&
        window.history &&
        window.history.state
      ) {
        const raw = window.history.state[this.STORAGE_KEY];

        if (Array.isArray(raw)) {
          this.incidents.set(raw as Incident[]);
          return;
        }
      }
    } catch {
      // ignore
    }

    // MOCK JSON

    this.http
      .get<Incident[]>(
        'assets/incidents.json'
      )
      .subscribe({

        next: (incidents) => {

          this.incidents.set(
            incidents
          );

          this.persistIncidents();
        },

        error: (error) => {

          console.error(
            'Failed to load incidents',
            error
          );
        },
      });
  }

  // SAVE TO STORAGE

  persistIncidents(): void {

    try {
      if (
        typeof window !== 'undefined' &&
        window.history &&
        typeof window.history.replaceState === 'function'
      ) {
        const prev = window.history.state || {};
        const next = { ...prev, [this.STORAGE_KEY]: this.incidents() };
        window.history.replaceState(next, document.title);
      }
    } catch {
      // ignore
    }
  }

  // ADD INCIDENT

  addIncident(
    incident: Omit<
      Incident,
      'id' | 'status'
    >
  ): void {

    const newIncident:
      Incident = {

      ...incident,

      id: Date.now(),

      status: 'Open',
    };

    this.incidents.update(
      (incidents) => [

        newIncident,

        ...incidents,
      ]
    );

    this.persistIncidents();
  }

  // UPDATE STATUS

  updateIncidentStatus(

    id: number,

    status:
      | 'Open'
      | 'In Progress'
      | 'Resolved'
  ): void {

    this.incidents.update(
      (incidents) =>

        incidents.map(
          (incident) =>

            incident.id === id

              ? {
                  ...incident,
                  status,
                }

              : incident
        )
    );

    this.persistIncidents();
  }

  // DELETE

  deleteIncident(
    id: number
  ): void {

    this.incidents.update(
      (incidents) =>

        incidents.filter(
          (incident) =>
            incident.id !== id
        )
    );

    this.persistIncidents();
  }

  // SELECT

  selectIncident(
    incident: Incident
  ): void {

    this.selectedIncident.set(
      incident
    );
  }

  // CLEAR

  clearSelectedIncident(): void {

    this.selectedIncident.set(
      null
    );
  }
}