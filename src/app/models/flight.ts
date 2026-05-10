export interface Flight {
  id: string;
  flightNumber: string;
  aircraftType?: string;
  origin: string;
  destination: string;
  firRegion?: string;
  latitude: number;
  longitude: number;
  altitude: number; // meters
  speed: number; // km/h
  departure: string; // ISO datetime string
  arrival: string; // ISO datetime string
  eta?: string; // ISO or human
  lastUpdated?: string; // ISO
  status: 'scheduled' | 'boarding' | 'departed' | 'enroute' | 'delayed' | 'landed';
  capacity?: number;
  delayMinutes?: number;
}
