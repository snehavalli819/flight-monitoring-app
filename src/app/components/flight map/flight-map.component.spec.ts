import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';
import {
  expect,
  vi,
} from 'vitest';
import {
  Router,
} from '@angular/router';

import {
  MatDialog,
} from '@angular/material/dialog';

import {
  FlightsListComponent,
  Flight,
} from '../flight list/flights-list.component';

import {
  FlightService,
} from '../../services/flight.service';

import {
  FlightDetailComponent,
} from '../flight detail/flight-detail.component';

describe(
  'FlightsListComponent',
  () => {

    let component:
      FlightsListComponent;

    let fixture:
      ComponentFixture<FlightsListComponent>;

    let routerSpy:
      any;

    let dialogSpy:
      any;

    let mockFlightService:
      any;

    const mockFlights:
      Flight[] = [

      {
        id: 'AI102',

        aircraftType:
          'Boeing 787',

        departureAirport:
          'DEL',

        destinationAirport:
          'LHR',

        firRegion:
          'Mumbai FIR',

        delayMinutes: 0,

        latitude: 28.61,

        longitude: 77.20,

        altitude: 36000,

        speed: 840,

        eta: '02:45',

        status: 'Enroute',

        lastUpdated:
          '2026-05-12T10:30:00Z',
      },

      {
        id: 'UK221',

        aircraftType:
          'Airbus A320',

        departureAirport:
          'BOM',

        destinationAirport:
          'DXB',

        firRegion:
          'Mumbai FIR',

        delayMinutes: 40,

        latitude: 19.07,

        longitude: 72.87,

        altitude: 30000,

        speed: 700,

        eta: '03:00',

        status: 'Delayed',

        lastUpdated:
          '2026-05-12T11:00:00Z',
      },
    ];

    beforeEach(async () => {

      routerSpy = { navigate : vi.fn()}

      dialogSpy ={
        open:vi.fn()
    }

      mockFlightService = {

  updateSearchTerm:
    vi.fn(),

  updateStatusFilter:
    vi.fn(),

  updateAircraftFilter:
    vi.fn(),

  updateFIRFilter:
    vi.fn(),

  flights:
    signal(mockFlights),

  filteredFlights:
    signal(mockFlights),

  selectedStatus:
    signal('ALL'),

  selectedAircraft:
    signal('ALL'),

  selectedFIR:
    signal('ALL'),
};

      await TestBed.configureTestingModule({

        imports: [
          FlightsListComponent,
        ],

        providers: [

          {
            provide:
              Router,

            useValue:
              routerSpy,
          },

          {
            provide:
              MatDialog,

            useValue:
              dialogSpy,
          },

          {
            provide:
              FlightService,

            useValue:
              mockFlightService,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          FlightsListComponent
        );

      component =
        fixture.componentInstance;

      fixture.detectChanges();
    });

    it(
      'should create',
      () => {

        expect(component)
          .toBeTruthy();
      }
    );

    it(
      'should initialize displayed columns',
      () => {

        expect(
          component.displayedColumns
        ).toEqual([

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
        ]);
      }
    );

    it(
      'should expose flights signal',
      () => {

        expect(
          component.flights()
            .length
        ).toBe(2);
      }
    );

    it(
      'should expose filtered flights',
      () => {

        expect(
          component
            .filteredFlights()
            .length
        ).toBe(2);
      }
    );

    it(
      'should expose selected status',
      () => {

        expect(
          component.selectedStatus()
        ).toBe('ALL');
      }
    );

    it(
      'should expose selected aircraft',
      () => {

        expect(
          component
            .selectedAircraft()
        ).toBe('ALL');
      }
    );

    it(
      'should expose selected FIR',
      () => {

        expect(
          component.selectedFIR()
        ).toBe('ALL');
      }
    );

   it(
  'should update search term',
  async () => {

    component.searchControl
      .setValue('AI102');

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          450
        )
    );

    expect(
      mockFlightService
        .updateSearchTerm
    ).toHaveBeenCalledWith(
      'AI102'
    );
  }
);

    it(
      'should update status filter',
      () => {

        component.onStatusChange(
          'Delayed'
        );

        expect(
          mockFlightService
            .updateStatusFilter
        ).toHaveBeenCalledWith(
          'Delayed'
        );
      }
    );

    it(
      'should update aircraft filter',
      () => {

        component.onAircraftChange(
          'Boeing 787'
        );

        expect(
          mockFlightService
            .updateAircraftFilter
        ).toHaveBeenCalledWith(
          'Boeing 787'
        );
      }
    );

    it(
      'should update FIR filter',
      () => {

        component.onFIRChange(
          'Mumbai FIR'
        );

        expect(
          mockFlightService
            .updateFIRFilter
        ).toHaveBeenCalledWith(
          'Mumbai FIR'
        );
      }
    );

    it(
      'should return enroute class',
      () => {

        expect(
          component.getStatusClass(
            'Enroute'
          )
        ).toBe(
          'status-enroute'
        );
      }
    );

    it(
      'should return delayed class',
      () => {

        expect(
          component.getStatusClass(
            'Delayed'
          )
        ).toBe(
          'status-delayed'
        );
      }
    );

    it(
      'should return boarding class',
      () => {

        expect(
          component.getStatusClass(
            'Boarding'
          )
        ).toBe(
          'status-boarding'
        );
      }
    );

    it(
      'should return landed class',
      () => {

        expect(
          component.getStatusClass(
            'Landed'
          )
        ).toBe(
          'status-landed'
        );
      }
    );

    it(
      'should return default class',
      () => {

        expect(
          component.getStatusClass(
            'Unknown'
          )
        ).toBe(
          'status-default'
        );
      }
    );

    it(
      'should track by flight id',
      () => {

        const result =
          component.trackByFlightId(
            0,
            mockFlights[0]
          );

        expect(result)
          .toBe('AI102');
      }
    );

    it(
      'should navigate to map',
      () => {

        component.trackFlight(
          mockFlights[0]
        );

        expect(
          routerSpy.navigate
        ).toHaveBeenCalledWith(
          ['/map']
        );
      }
    );

    it(
      'should open flight details dialog',
      () => {

        component.openFlightDetails(
          mockFlights[0]
        );

       expect(
  dialogSpy.open
).toHaveBeenCalledWith(

  FlightDetailComponent,

  expect.objectContaining({

    width: '950px',

    maxWidth: '95vw',

    panelClass:
      'flight-details-dialog',

    data:
      mockFlights[0],
  })
);
      }
    );

    it(
      'should render template',
      () => {

        const compiled =
          fixture.nativeElement;

        expect(compiled)
          .toBeTruthy();
      }
    );

    it(
      'should detect changes',
      () => {

        fixture.detectChanges();

        expect(component)
          .toBeDefined();
      }
    );

    it(
      'should initialize searchControl with empty string',
      () => {

        expect(
          component.searchControl.value
        ).toBe('');
      }
    );

    it(
      'should contain mock flight data',
      () => {

        expect(
          component.flights()[0].id
        ).toBe('AI102');

        expect(
          component.flights()[1].status
        ).toBe('Delayed');
      }
    );
  }
);