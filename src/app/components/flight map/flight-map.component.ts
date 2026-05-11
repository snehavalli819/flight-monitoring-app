import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

// Leaflet is large; import it lazily inside the map initializer to keep
// the initial bundle small.
let L: any;

import { interval } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlightService } from '../../services/flight.service';

import { Flight as ServiceFlight } from '../../services/mock-flight-socket.service';

type Flight = ServiceFlight;

@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './flight-map.component.html',
  styleUrls: ['./flight-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightMapComponent
  implements AfterViewInit
{
  private destroyRef = inject(DestroyRef);

  private map: any;

  private markers: Map<string, any> = new Map();

  private polylines: Map<string, any> = new Map();

  activeFilter = signal('ALL');

  filters = [
    'ALL',
    'Enroute',
    'Delayed',
    'Boarding',
    'Landed',
  ];
  private flightService = inject(FlightService);

  // use the centralized flight list and computed filtered results
  flights = this.flightService.flights;

  ngAfterViewInit(): void {
  this.initializeMap();

  // initial render from service data
  this.renderFlights();
  // react to service flight updates and refresh the map
  effect(() => {
    // read the signal to subscribe to changes
    this.flightService.flights();

    // schedule refresh after current microtask to ensure map exists
    Promise.resolve().then(() => this.refreshMap());
  });
  }

  // INITIALIZE MAP

  initializeMap(): void {
    // dynamic import
    import('leaflet').then((leaflet) => {
      L = leaflet;

      this.map = L.map('flight-map', {
        zoomControl: true,
      }).setView([22.9734, 78.6569], 5);

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors',
        }
      ).addTo(this.map);

      // if flights already present, render them now
      Promise.resolve().then(() => this.refreshMap());
    });
  }

  // RENDER FLIGHTS

  renderFlights(): void {

  this.filteredFlights().forEach((flight) => {

      // ICON

      const icon = this.createFlightIcon(
        flight.status
      );

      // MARKER

      const marker = L.marker(
        [flight.latitude, flight.longitude],
        { icon }
      )
        .addTo(this.map)
        .bindPopup(`
          <div style="width:220px">
            <h3>${flight.id}</h3>

            <p>
              <strong>Route:</strong>
              ${typeof (flight as any).route !== 'undefined' ? (flight as any).route : `${(flight as any).departureAirport} → ${(flight as any).destinationAirport}`}
            </p>

            <p>
              <strong>Speed:</strong>
              ${flight.speed} km/h
            </p>

            <p>
              <strong>Altitude:</strong>
              ${flight.altitude} ft
            </p>

            <p>
              <strong>Status:</strong>
              ${flight.status}
            </p>
          </div>
        `);

      this.markers.set(
        flight.id,
        marker
      );

      // ROUTE LINE

      const route = L.polyline(
        [
          [
            flight.latitude,
            flight.longitude,
          ],
          [
            flight.latitude + 5,
            flight.longitude + 8,
          ],
        ],
        {
          color:
            this.getRouteColor(
              flight.status
            ),
          weight: 4,
          opacity: 0.7,
        }
      ).addTo(this.map);

      this.polylines.set(
        flight.id,
        route
      );
    });
  }

  // LIVE SIMULATION USING RXJS

  // no local simulation - MockFlightSocketService inside FlightService
  // updates the `flights` signal which we use to refresh the map

  // FILTER

  setFilter(filter: string): void {

    this.activeFilter.set(filter);

    this.refreshMap();
  }

  // FILTERED FLIGHTS

  filteredFlights(): Flight[] {

    const all = this.flightService.flights();

    if (this.activeFilter() === 'ALL') {
      return all as any as Flight[];
    }

    return all.filter(
      (flight: any) =>
        flight.status ===
        this.activeFilter()
    );
  }

  // REFRESH MAP

  refreshMap(): void {

    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });

    this.polylines.forEach(
      (polyline) => {
        this.map.removeLayer(polyline);
      }
    );

    this.markers.clear();

    this.polylines.clear();

    this.renderFlights();
  }

  // ICON CREATOR

  createFlightIcon(
    status: string
  ): L.DivIcon {

    return L.divIcon({
      className: 'custom-flight-marker',

      html: `
        <div
          style="
            width:42px;
            height:42px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:${this.getMarkerColor(
              status
            )};
            color:white;
            font-size:20px;
            box-shadow:
              0 0 0 8px rgba(0,0,0,0.08);
          "
        >
          ✈
        </div>
      `,

      iconSize: [42, 42],

      iconAnchor: [21, 21],
    });
  }

  // MARKER COLORS

  getMarkerColor(
    status: string
  ): string {

    switch (status) {

      case 'Enroute':
        return '#22c55e';

      case 'Delayed':
        return '#ef4444';

      case 'Boarding':
        return '#3b82f6';

      case 'Landed':
        return '#8b5cf6';

      default:
        return '#64748b';
    }
  }

  // ROUTE COLORS

  getRouteColor(
    status: string
  ): string {

    switch (status) {

      case 'Enroute':
        return '#22c55e';

      case 'Delayed':
        return '#ef4444';

      case 'Boarding':
        return '#3b82f6';

      case 'Landed':
        return '#8b5cf6';

      default:
        return '#64748b';
    }
  }

  // RANDOM HELPERS

  randomNumber(
    min: number,
    max: number
  ): number {

    return Math.floor(
      Math.random() *
        (max - min + 1) +
        min
    );
  }

  randomValue(
    min: number,
    max: number
  ): number {

    return (
      Math.random() *
        (max - min) +
      min
    );
  }
}