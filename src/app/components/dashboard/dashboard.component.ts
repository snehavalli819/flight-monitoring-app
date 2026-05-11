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
import { FlightDetailComponent } from '../flight detail/flight-detail.component';
import { FlightsListComponent } from '../flight list/flights-list.component';
import { FlightMapComponent } from '../flight map/flight-map.component';
import { AlertPanelComponent } from '../alert-panel/alert-panel.component';
import { FlightService } from '../../services/flight.service';

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
    FlightMapComponent,
    AlertPanelComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private flightService = inject(FlightService);

  // use service signals/computeds
  alertsCount = signal(12); // keep alerts stubbed for now

  stats = computed<DashboardStat[]>(() => {
    return [
      {
        title: 'Total Flights',
        count: this.flightService.totalFlights(),
        icon: 'flight',
        color: '#1976d2',
        subText: '+12 from last hour',
      },
      {
        title: 'Enroute',
        count: this.flightService.activeFlights().length,
        icon: 'travel_explore',
        color: '#2e7d32',
        subText: '64.1%',
      },
      {
        title: 'Delayed',
        count: this.flightService.delayedFlights().length,
        icon: 'warning',
        color: '#d32f2f',
        subText: '10.9%',
      },
      {
        title: 'Landed',
        count: this.flightService.landedFlights(),
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
