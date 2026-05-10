import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

interface CommunicationLog {
  time: string;
  sender: string;
  message: string;
}

interface DelayHistory {
  reason: string;
  delayMinutes: number;
  timestamp: string;
}

@Component({
  selector: 'app-flight-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightDetailComponent {
  selectedFlight = signal({
    flightId: 'AI102',
    aircraftType: 'Boeing 787 Dreamliner',
    airline: 'Air India',
    departureAirport: 'Delhi (DEL)',
    destinationAirport: 'London Heathrow (LHR)',
    firRegion: 'Mumbai FIR',
    altitude: 36000,
    speed: 840,
    eta: '02:45 HRS',
    status: 'Enroute',
    gate: 'A12',
    terminal: 'T3',
    captain: 'Captain James',
    coPilot: 'Alex Morgan',
    fuelLevel: '68%',
    weather: 'Clear Sky',
    lastUpdated: '2 mins ago',
  });

  timeline = signal([
    {
      status: 'Scheduled',
      time: '08:00 AM',
      completed: true,
    },
    {
      status: 'Boarding',
      time: '08:45 AM',
      completed: true,
    },
    {
      status: 'Departed',
      time: '09:20 AM',
      completed: true,
    },
    {
      status: 'Enroute',
      time: 'Currently Active',
      completed: true,
    },
    {
      status: 'Landing',
      time: 'ETA 02:45 HRS',
      completed: false,
    },
  ]);

  delayHistory = signal<DelayHistory[]>([
    {
      reason: 'Weather congestion',
      delayMinutes: 18,
      timestamp: '09:10 AM',
    },
    {
      reason: 'Runway traffic',
      delayMinutes: 12,
      timestamp: '09:18 AM',
    },
  ]);

  communicationLogs = signal<CommunicationLog[]>([
    {
      time: '10:20 AM',
      sender: 'ATC',
      message:
        'Maintain altitude FL360 and continue current heading.',
    },
    {
      time: '10:28 AM',
      sender: 'Pilot',
      message:
        'Acknowledged. Maintaining FL360.',
    },
    {
      time: '10:40 AM',
      sender: 'ATC',
      message:
        'Minor turbulence reported ahead near sector B12.',
    },
  ]);

  flightStatusClass = computed(() => {
    const status = this.selectedFlight().status;

    switch (status) {
      case 'Enroute':
        return 'status-enroute';

      case 'Delayed':
        return 'status-delayed';

      case 'Landed':
        return 'status-landed';

      default:
        return 'status-default';
    }
  });

  trackByTimeline = (_: number, item: any) =>
    item.status;

  trackByDelay = (_: number, item: DelayHistory) =>
    item.timestamp;

  trackByLog = (_: number, item: CommunicationLog) =>
    item.time;
}