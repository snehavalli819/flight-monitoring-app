import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlightDetailComponent } from '../flight detail/flight-detail.component';
import { FlightsListComponent } from '../flight list/flights-list.component';
import { FlightMapComponent } from '../flight map/flight-map.component';

interface DashboardStat {
  title: string;
  count: number;
  icon: string;
  color: string;
  subText: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlightDetailComponent,
    FlightsListComponent,
    FlightMapComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  flights = signal([
    {
      id: 'AI102',
      status: 'Enroute',
    },
    {
      id: 'UK507',
      status: 'Delayed',
    },
    {
      id: '6E890',
      status: 'Enroute',
    },
    {
      id: 'AI221',
      status: 'Landed',
    },
  ]);

  alertsCount = signal(12);

  stats = computed<DashboardStat[]>(() => {
    const flights = this.flights();

    return [
      {
        title: 'Total Flights',
        count: flights.length,
        icon: 'flight',
        color: '#1976d2',
        subText: '+12 from last hour',
      },
      {
        title: 'Enroute',
        count: flights.filter((f) => f.status === 'Enroute').length,
        icon: 'travel_explore',
        color: '#2e7d32',
        subText: '64.1%',
      },
      {
        title: 'Delayed',
        count: flights.filter((f) => f.status === 'Delayed').length,
        icon: 'warning',
        color: '#d32f2f',
        subText: '10.9%',
      },
      {
        title: 'Landed',
        count: flights.filter((f) => f.status === 'Landed').length,
        icon: 'flight_land',
        color: '#7b1fa2',
        subText: '18.8%',
      },
      {
        title: 'Alerts',
        count: this.alertsCount(),
        icon: 'notifications_active',
        color: '#ed6c02',
        subText: 'View all alerts',
      },
    ];
  });

  trackByTitle = (_: number, item: DashboardStat) => item.title;
}
