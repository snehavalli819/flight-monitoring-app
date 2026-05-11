import {
  Injectable,
  signal,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  interval,
} from 'rxjs';

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

  status:
    | 'Scheduled'
    | 'Boarding'
    | 'Departed'
    | 'Enroute'
    | 'Delayed'
    | 'Landed';

  eta: string;

  lastUpdated: string;

  delayMinutes: number;
}

@Injectable({
  providedIn: 'root',
})
export class MockFlightSocketService {

  // REALTIME STREAM

  private flightsSubject =
    new BehaviorSubject<Flight[]>([]);

  flights$ =
    this.flightsSubject.asObservable();

  // SIGNALS (OPTIONAL)

  flightsSignal =
    signal<Flight[]>([]);

  constructor(
    private http: HttpClient
  ) {

    this.loadFlights();
  }

  // LOAD MOCK JSON

  loadFlights(): void {

    this.http
      .get<Flight[]>(
        'assets/flights.json'
      )
      .subscribe({

        next: (flights) => {

          this.flightsSubject.next(
            flights
          );

          this.flightsSignal.set(
            flights
          );

          // START SIMULATION

          this.startRealtimeSimulation();
        },

        error: (error) => {

          console.error(
            'Failed to load flights',
            error
          );
        },
      });
  }

  // REALTIME SIMULATION

  startRealtimeSimulation(): void {

    interval(3000).subscribe(() => {

      const updatedFlights =
        this.flightsSubject
          .value
          .map((flight) => {

            // RANDOM STATUS

            const updatedStatus =
              this.getRandomStatus(
                flight.status
              );

            // RANDOM MOVEMENT

            const updatedLatitude =
              flight.latitude +
              this.randomDecimal(
                -0.5,
                0.5
              );

            const updatedLongitude =
              flight.longitude +
              this.randomDecimal(
                -0.5,
                0.5
              );

            // SPEED UPDATE

            const updatedSpeed =
              flight.speed +
              this.randomNumber(
                -20,
                20
              );

            // ALTITUDE UPDATE

            const updatedAltitude =
              flight.altitude +
              this.randomNumber(
                -500,
                500
              );

            // DELAY UPDATE

            const updatedDelay =
              updatedStatus ===
              'Delayed'
                ? flight.delayMinutes +
                  this.randomNumber(
                    5,
                    15
                  )
                : flight.delayMinutes;

            return {

              ...flight,

              latitude:
                updatedLatitude,

              longitude:
                updatedLongitude,

              speed:
                updatedSpeed,

              altitude:
                updatedAltitude,

              status:
                updatedStatus,

              delayMinutes:
                updatedDelay,

              lastUpdated:
                new Date().toISOString(),
            };
          });

      // UPDATE STREAM

      this.flightsSubject.next(
        updatedFlights
      );

      // UPDATE SIGNAL

      this.flightsSignal.set(
        updatedFlights
      );
    });
  }

  // RANDOM STATUS

  getRandomStatus(
    currentStatus: string
  ): any {

    const statuses = [

      'Scheduled',

      'Boarding',

      'Departed',

      'Enroute',

      'Delayed',

      'Landed',
    ];

    // KEEP LANDED STABLE

    if (
      currentStatus === 'Landed'
    ) {
      return 'Landed';
    }

    return statuses[
      Math.floor(
        Math.random() *
          statuses.length
      )
    ];
  }

  // RANDOM INTEGER

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

  // RANDOM DECIMAL

  randomDecimal(
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