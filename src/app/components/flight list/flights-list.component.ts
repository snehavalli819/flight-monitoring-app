import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';

import { toSignal } from '@angular/core/rxjs-interop';
import { FlightService } from '../../services/flight.service';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Flight {
  id: string;
  aircraftType: string;
  departureAirport: string;
  destinationAirport: string;
  firRegion: string;

  latitude: number;
  longitude: number;

  altitude: number;
  speed: number;

  eta: string;

  status:
    | 'Scheduled'
    | 'Boarding'
    | 'Departed'
    | 'Enroute'
    | 'Delayed'
    | 'Landed';

  lastUpdated: string;
}

@Component({
  selector: 'app-flights-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './flights-list.component.html',
  styleUrls: ['./flights-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightsListComponent {

  displayedColumns = [
    'flightId',
    'aircraft',
    'route',
    'fir',
    'altitude',
    'speed',
    'status',
    'eta',
    'updated',
    'actions',
  ];

  // SEARCH + FILTERS

  searchControl = new FormControl('', {
    nonNullable: true,
  });

  // Use centralized FlightService to supply flight data
  private flightService = inject(FlightService);

  flights = this.flightService.flights;

  selectedStatus = this.flightService.selectedStatus;

  selectedAircraft = this.flightService.selectedAircraft;

  selectedFIR = this.flightService.selectedFIR;

  // RXJS SEARCH
  // forward control changes to central service
  constructor() {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(400), distinctUntilChanged())
      .subscribe((value) => this.flightService.updateSearchTerm(value as string));
  }

  // FILTERED FLIGHTS (delegate to service)
  filteredFlights = computed(() => this.flightService.filteredFlights());

  // STATUS STYLE

  getStatusClass(status: string): string {

    switch (status) {

      case 'Enroute':
        return 'status-enroute';

      case 'Delayed':
        return 'status-delayed';

      case 'Boarding':
        return 'status-boarding';

      case 'Landed':
        return 'status-landed';

      default:
        return 'status-default';
    }
  }

  // FILTER METHODS

  onStatusChange(status: string): void {
  this.flightService.updateStatusFilter(status);
  }

  onAircraftChange(type: string): void {
  this.flightService.updateAircraftFilter(type);
  }

  onFIRChange(fir: string): void {
  this.flightService.updateFIRFilter(fir);
  }

  // TRACKBY

  trackByFlightId = (
    _: number,
    item: Flight
  ) => item.id;

  // ACTIONS

  trackFlight(flight: Flight): void {
    console.log('Tracking flight', flight);
  }

  openFlightDetails(flight: Flight): void {
    console.log('Flight details', flight);
  }
}