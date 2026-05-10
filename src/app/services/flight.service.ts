import { Injectable, signal, computed, effect } from '@angular/core';
import { Flight } from '../models/flight';
import { interval, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private flightsSignal = signal<Flight[]>([]);
  readonly flights = computed(() => this.flightsSignal());

  // observable-like subject for external subscribers
  readonly updates$ = new Subject<Flight[]>();

  private simTick$ = interval(3000);

  constructor() {
    // seed with sample data (lat/lon roughly over US)
    const now = new Date();
    const later = new Date(now.getTime() + 1000 * 60 * 90);
    this.flightsSignal.set([
      {
        id: 'F001',
        flightNumber: 'AA100',
        aircraftType: 'A320',
        origin: 'JFK',
        destination: 'LAX',
        firRegion: 'KZNY',
        latitude: 40.6413,
        longitude: -73.7781,
        altitude: 0,
        speed: 0,
        departure: now.toISOString(),
        arrival: later.toISOString(),
        eta: later.toISOString(),
        lastUpdated: now.toISOString(),
        status: 'scheduled',
        capacity: 180,
        delayMinutes: 0,
      },
      {
        id: 'F002',
        flightNumber: 'DL200',
        aircraftType: 'B737',
        origin: 'SFO',
        destination: 'ORD',
        firRegion: 'KZLA',
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 10000,
        speed: 750,
        departure: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
        arrival: new Date(now.getTime() + 1000 * 60 * 120).toISOString(),
        eta: new Date(now.getTime() + 1000 * 60 * 120).toISOString(),
        lastUpdated: now.toISOString(),
        status: 'enroute',
        capacity: 160,
        delayMinutes: 0,
      },
    ]);

    // simulation effect: update flights every tick
    this.simTick$.subscribe(() => this.simulateStep());

    // publish initial
    effect(() => this.updates$.next(this.flights()));
  }

  list(): Flight[] {
    return this.flights();
  }

  get(id: string): Flight | undefined {
    return this.flights().find((f) => f.id === id);
  }

  add(f: Flight) {
    this.flightsSignal.update((arr) => [...arr, f]);
  }

  update(id: string, patch: Partial<Flight>) {
    this.flightsSignal.update((arr) => arr.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  remove(id: string) {
    this.flightsSignal.update((arr) => arr.filter((f) => f.id !== id));
  }

  private simulateStep() {
    // simple simulation: move enroute flights slightly, change altitude/speed
    this.flightsSignal.update((arr) =>
      arr.map((f) => {
        const copy = { ...f };
        const now = new Date();
        copy.lastUpdated = now.toISOString();

        // random small deltas
        const dLat = (Math.random() - 0.5) * 0.1;
        const dLon = (Math.random() - 0.5) * 0.1;
        const dAlt = (Math.random() - 0.5) * 200; // meters
        const dSpeed = (Math.random() - 0.5) * 50; // km/h

        if (copy.status === 'enroute' || copy.status === 'departed') {
          copy.latitude = +(copy.latitude + dLat).toFixed(6);
          copy.longitude = +(copy.longitude + dLon).toFixed(6);
          copy.altitude = Math.max(0, Math.round(copy.altitude + dAlt));
          copy.speed = Math.max(0, Math.round(copy.speed + dSpeed));

          // ETA reduce slightly
          if (copy.eta) {
            const etaDate = new Date(copy.eta).getTime() - 1000 * 30; // 30s less
            copy.eta = new Date(Math.max(etaDate, Date.now())).toISOString();
          }

          // random status transitions
          if (Math.random() < 0.02) {
            copy.status = 'delayed';
            copy.delayMinutes = (copy.delayMinutes || 0) + 10;
          }
        } else if (copy.status === 'scheduled' && Math.random() < 0.4) {
          copy.status = 'boarding';
        } else if (copy.status === 'boarding' && Math.random() < 0.5) {
          copy.status = 'departed';
          copy.speed = 300 + Math.random() * 300;
          copy.altitude = 2000 + Math.random() * 8000;
        }

        return copy;
      })
    );

    // publish
    this.updates$.next(this.flights());
  }
}

