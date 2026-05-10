import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as L from 'leaflet';

import { interval } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Flight {
  id: string;

  latitude: number;
  longitude: number;

  speed: number;
  altitude: number;

  route: string;

  status:
    | 'Enroute'
    | 'Delayed'
    | 'Boarding'
    | 'Landed';
}

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

  private map!: L.Map;

  private markers:
    Map<string, L.Marker> = new Map();

  private polylines:
    Map<string, L.Polyline> = new Map();

  activeFilter = signal('ALL');

  filters = [
    'ALL',
    'Enroute',
    'Delayed',
    'Boarding',
    'Landed',
  ];

  flights = signal<Flight[]>([
    {
      id: 'AI102',
      latitude: 28.6139,
      longitude: 77.2090,
      speed: 840,
      altitude: 36000,
      route: 'DEL → LHR',
      status: 'Enroute',
    },
    {
      id: 'UK221',
      latitude: 19.0760,
      longitude: 72.8777,
      speed: 720,
      altitude: 28000,
      route: 'BOM → DXB',
      status: 'Delayed',
    },
    {
      id: '6E990',
      latitude: 13.0827,
      longitude: 80.2707,
      speed: 420,
      altitude: 12000,
      route: 'MAA → SIN',
      status: 'Boarding',
    },
  ]);

  ngAfterViewInit(): void {

    this.initializeMap();

    this.renderFlights();

    this.startFlightSimulation();
  }

  // INITIALIZE MAP

  initializeMap(): void {

    this.map = L.map('flight-map', {
      zoomControl: true,
    }).setView([22.9734, 78.6569], 5);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '© OpenStreetMap contributors',
      }
    ).addTo(this.map);
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
              ${flight.route}
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

  startFlightSimulation(): void {

    interval(3000)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        this.flights.update((flights) =>

          flights.map((flight) => {

            const updatedLat =
              flight.latitude +
              this.randomValue(
                -0.8,
                0.8
              );

            const updatedLng =
              flight.longitude +
              this.randomValue(
                -0.8,
                0.8
              );

            const updatedFlight = {
              ...flight,

              latitude: updatedLat,

              longitude: updatedLng,

              speed:
                flight.speed +
                this.randomNumber(
                  -20,
                  20
                ),

              altitude:
                flight.altitude +
                this.randomNumber(
                  -500,
                  500
                ),
            };

            // UPDATE MARKER

            const marker =
              this.markers.get(
                flight.id
              );

            marker?.setLatLng([
              updatedLat,
              updatedLng,
            ]);

            // UPDATE POPUP

            marker?.setPopupContent(`
              <div style="width:220px">
                <h3>${updatedFlight.id}</h3>

                <p>
                  <strong>Route:</strong>
                  ${updatedFlight.route}
                </p>

                <p>
                  <strong>Speed:</strong>
                  ${updatedFlight.speed} km/h
                </p>

                <p>
                  <strong>Altitude:</strong>
                  ${updatedFlight.altitude} ft
                </p>

                <p>
                  <strong>Status:</strong>
                  ${updatedFlight.status}
                </p>
              </div>
            `);

            // UPDATE ROUTE

            const polyline =
              this.polylines.get(
                flight.id
              );

            polyline?.setLatLngs([
              [
                updatedLat,
                updatedLng,
              ],
              [
                updatedLat + 5,
                updatedLng + 8,
              ],
            ]);

            return updatedFlight;
          })
        );
      });
  }

  // FILTER

  setFilter(filter: string): void {

    this.activeFilter.set(filter);

    this.refreshMap();
  }

  // FILTERED FLIGHTS

  filteredFlights(): Flight[] {

    if (this.activeFilter() === 'ALL') {
      return this.flights();
    }

    return this.flights().filter(
      (flight) =>
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