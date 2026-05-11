import {
  Injectable,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  MockFlightSocketService,
  Flight,
} from './mock-flight-socket.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private socketService =
    inject(
      MockFlightSocketService
    );

  // CENTRALIZED FLIGHT STATE

  flights =
    this.socketService
      .flightsSignal;

  // SELECTED FLIGHT

  selectedFlight =
    signal<Flight | null>(null);

  // SEARCH TERM

  searchTerm =
    signal('');

  // FILTERS

  selectedStatus =
    signal('ALL');

  selectedAircraft =
    signal('ALL');

  selectedFIR =
    signal('ALL');

  // FILTERED FLIGHTS

  filteredFlights = computed(() => {

    const search =
      this.searchTerm()
        .toLowerCase()
        .trim();

    return this.flights().filter(
      (flight) => {

        // SEARCH

        const matchesSearch =

          flight.id
            .toLowerCase()
            .includes(search) ||

          flight.departureAirport
            .toLowerCase()
            .includes(search) ||

          flight.destinationAirport
            .toLowerCase()
            .includes(search) ||

          flight.firRegion
            .toLowerCase()
            .includes(search);

        // STATUS FILTER

        const matchesStatus =

          this.selectedStatus() ===
            'ALL' ||

          flight.status ===
            this.selectedStatus();

        // AIRCRAFT FILTER

        const matchesAircraft =

          this.selectedAircraft() ===
            'ALL' ||

          flight.aircraftType ===
            this.selectedAircraft();

        // FIR FILTER

        const matchesFIR =

          this.selectedFIR() ===
            'ALL' ||

          flight.firRegion ===
            this.selectedFIR();

        return (

          matchesSearch &&

          matchesStatus &&

          matchesAircraft &&

          matchesFIR
        );
      }
    );
  });

  // ACTIVE FLIGHTS

  activeFlights = computed(() =>

    this.flights().filter(
      (flight) =>
        flight.status !==
        'Landed'
    )
  );

  // DELAYED FLIGHTS

  delayedFlights = computed(() =>

    this.flights().filter(
      (flight) =>
        flight.status ===
        'Delayed'
    )
  );

  // CRITICAL FLIGHTS

  criticalFlights = computed(() =>

    this.flights().filter(
      (flight) =>

        flight.altitude < 10000 ||

        flight.speed > 900 ||

        flight.delayMinutes > 30
    )
  );

  // FLIGHT COUNTS

  totalFlights = computed(() =>

    this.flights().length
  );

  landedFlights = computed(() =>

    this.flights().filter(
      (flight) =>
        flight.status ===
        'Landed'
    ).length
  );

  // SEARCH

  updateSearchTerm(
    value: string
  ): void {

    this.searchTerm.set(value);
  }

  // STATUS FILTER

  updateStatusFilter(
    status: string
  ): void {

    this.selectedStatus.set(
      status
    );
  }

  // AIRCRAFT FILTER

  updateAircraftFilter(
    aircraft: string
  ): void {

    this.selectedAircraft.set(
      aircraft
    );
  }

  // FIR FILTER

  updateFIRFilter(
    fir: string
  ): void {

    this.selectedFIR.set(fir);
  }

  // SELECT FLIGHT

  selectFlight(
    flight: Flight
  ): void {

    this.selectedFlight.set(
      flight
    );
  }

  // CLEAR SELECTION

  clearSelectedFlight(): void {

    this.selectedFlight.set(null);
  }

  // GET FLIGHT BY ID

  getFlightById(
    id: string
  ): Flight | undefined {

    return this.flights().find(
      (flight) =>
        flight.id === id
    );
  }

  // RESET FILTERS

  resetFilters(): void {

    this.searchTerm.set('');

    this.selectedStatus.set(
      'ALL'
    );

    this.selectedAircraft.set(
      'ALL'
    );

    this.selectedFIR.set(
      'ALL'
    );
  }

  // STATUS CLASS

  getStatusClass(
    status: string
  ): string {

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

  // ALERT CONDITIONS

  hasAltitudeAlert(
    flight: Flight
  ): boolean {

    return (
      flight.altitude < 10000
    );
  }

  hasSpeedAlert(
    flight: Flight
  ): boolean {

    return (
      flight.speed > 900
    );
  }

  hasDelayAlert(
    flight: Flight
  ): boolean {

    return (
      flight.delayMinutes > 30
    );
  }
}