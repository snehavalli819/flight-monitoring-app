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

  selectedStatus = signal('ALL');

  selectedAircraft = signal('ALL');

  selectedFIR = signal('ALL');

  // MOCK FLIGHTS

  flights = signal<Flight[]>([
    {
      id: 'AI102',
      aircraftType: 'Boeing 787',
      departureAirport: 'DEL',
      destinationAirport: 'LHR',
      firRegion: 'Mumbai FIR',
      latitude: 28.6,
      longitude: 77.2,
      altitude: 36000,
      speed: 840,
      eta: '02:45 HRS',
      status: 'Enroute',
      lastUpdated: '2 mins ago',
    },
    {
      id: '6E221',
      aircraftType: 'Airbus A320',
      departureAirport: 'HYD',
      destinationAirport: 'BLR',
      firRegion: 'Chennai FIR',
      latitude: 17.3,
      longitude: 78.4,
      altitude: 29000,
      speed: 720,
      eta: '01:10 HRS',
      status: 'Delayed',
      lastUpdated: '1 min ago',
    },
    {
      id: 'UK990',
      aircraftType: 'Boeing 737',
      departureAirport: 'BOM',
      destinationAirport: 'DXB',
      firRegion: 'Mumbai FIR',
      latitude: 19.1,
      longitude: 72.8,
      altitude: 34000,
      speed: 810,
      eta: '03:15 HRS',
      status: 'Enroute',
      lastUpdated: 'Just now',
    },
    {
      id: 'SG501',
      aircraftType: 'Airbus A321',
      departureAirport: 'MAA',
      destinationAirport: 'SIN',
      firRegion: 'Chennai FIR',
      latitude: 13.0,
      longitude: 80.2,
      altitude: 12000,
      speed: 420,
      eta: '00:45 HRS',
      status: 'Boarding',
      lastUpdated: '5 mins ago',
    },
  ]);

  // RXJS SEARCH

  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  // FILTERED FLIGHTS

  filteredFlights = computed(() => {

    const term = this.searchTerm()
      .toLowerCase()
      .trim();

    return this.flights().filter((flight) => {

      const matchesSearch =
        flight.id.toLowerCase().includes(term) ||
        flight.departureAirport
          .toLowerCase()
          .includes(term) ||
        flight.destinationAirport
          .toLowerCase()
          .includes(term) ||
        flight.firRegion
          .toLowerCase()
          .includes(term);

      const matchesStatus =
        this.selectedStatus() === 'ALL' ||
        flight.status === this.selectedStatus();

      const matchesAircraft =
        this.selectedAircraft() === 'ALL' ||
        flight.aircraftType ===
          this.selectedAircraft();

      const matchesFIR =
        this.selectedFIR() === 'ALL' ||
        flight.firRegion ===
          this.selectedFIR();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAircraft &&
        matchesFIR
      );
    });
  });

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
    this.selectedStatus.set(status);
  }

  onAircraftChange(type: string): void {
    this.selectedAircraft.set(type);
  }

  onFIRChange(fir: string): void {
    this.selectedFIR.set(fir);
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