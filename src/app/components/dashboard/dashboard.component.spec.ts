import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';

import {
  Router,
} from '@angular/router';

import {
  DashboardComponent,
} from './dashboard.component';

import {
  FlightService,
} from '../../services/flight.service';

import {
  AuthService,
} from '../../services/auth.service';

import { vi } from 'vitest';
import { FlightMapComponent } from '../flight map/flight-map.component';

describe(
  'DashboardComponent',
  () => {

    let component:
      DashboardComponent;

    let fixture:
      ComponentFixture<DashboardComponent>;

    let routerSpy:
      any;

    let mockFlightService:
      any;

    let mockAuthService:
      any;

    beforeEach(async () => {

      routerSpy = { navigate : vi.fn()}

      mockFlightService = {


  updateSearchTerm:
    vi.fn(),

  updateStatusFilter:
    vi.fn(),

  updateAircraftFilter:
    vi.fn(),

  updateFIRFilter:
    vi.fn(),

  // SIGNALS

  totalFlights:
    signal(120),

  activeFlights:
    signal([
      { id: 1 },
      { id: 2 },
    ]),

  delayedFlights:
    signal([
      { id: 1 },
    ]),

  landedFlights:
    signal(25),

  flights:
    signal([]),

  filteredFlights:
    signal([]),

  selectedStatus:
    signal('ALL'),

  selectedAircraft:
    signal('ALL'),

  selectedFIR:
    signal('ALL'),
};

      mockAuthService ={
       canEdit:vi.fn()
      }

     await TestBed
  .configureTestingModule({

    imports: [
      DashboardComponent,
    ],

    providers: [
      {
        provide: FlightService,
        useValue:
          mockFlightService,
      },
    ],
  })

  .overrideComponent(
    DashboardComponent,
    {

      remove: {

        imports: [
          FlightMapComponent,
        ],
      },

      add: {

        imports: [],
      },
    }
  )

  .compileComponents();

      fixture =
        TestBed.createComponent(
          DashboardComponent
        );

      component =
        fixture.componentInstance;

      fixture.detectChanges();
    });

    // COMPONENT

    it(
      'should create',
      () => {

        expect(component)
          .toBeTruthy();
      }
    );

    // STATS

    it(
      'should generate stats list',
      () => {

        expect(
          component.stats().length
        ).toBe(5);
      }
    );

    // TOTAL FLIGHTS

    it(
      'should return total flights stat',
      () => {

        const stat =
          component.stats()[0];

        expect(
          stat.title
        ).toBe(
          'Total Flights'
        );

        expect(
          stat.count
        ).toBe(120);
      }
    );

    // ENROUTE

    it(
      'should return enroute stat',
      () => {

        const stat =
          component.stats()[1];

        expect(
          stat.title
        ).toBe(
          'Enroute'
        );

        expect(
          stat.count
        ).toBe(2);
      }
    );

    // DELAYED

    it(
      'should return delayed stat',
      () => {

        const stat =
          component.stats()[2];

        expect(
          stat.title
        ).toBe(
          'Delayed'
        );

        expect(
          stat.count
        ).toBe(1);
      }
    );

    // LANDED

    it(
      'should return landed stat',
      () => {

        const stat =
          component.stats()[3];

        expect(
          stat.title
        ).toBe(
          'Landed'
        );

        expect(
          stat.count
        ).toBe(25);
      }
    );

    // ALERTS

    it(
      'should return alerts stat',
      () => {

        const stat =
          component.stats()[4];

        expect(
          stat.title
        ).toBe(
          'Alerts'
        );

        expect(
          stat.count
        ).toBe(12);
      }
    );

    // TRACK BY

    it(
      'should track stats by title',
      () => {

        const result =
          component.trackByTitle(
            0,
            component.stats()[0]
          );

        expect(result)
          .toBe(
            'Total Flights'
          );
      }
    );

   

    it(
      'should not navigate for unknown title',
      () => {

       routerSpy.navigate.mockClear();

        component.navigateToForStat(
          'Unknown'
        );

        expect(
          routerSpy.navigate
        ).not.toHaveBeenCalled();
      }
    );

    // ALERT COUNT SIGNAL

    it(
      'should return alertsCount signal value',
      () => {

        expect(
          component.alertsCount()
        ).toBe(12);
      }
    );

    // TEMPLATE

    it(
      'should render template',
      () => {

        const compiled =
          fixture.nativeElement;

        expect(compiled)
          .toBeTruthy();
      }
    );

    // CHANGE DETECTION

    it(
      'should detect changes',
      () => {

        fixture.detectChanges();

        expect(component)
          .toBeDefined();
      }
    );

    // AUTH SERVICE

    it(
      'should inject auth service',
      () => {

        expect(
          component.authService
        ).toBeTruthy();
      }
    );
  }
);