import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  FlightDetailComponent,
  FlightDetailsData,
} from './flight-detail.component';

describe(
  'FlightDetailComponent',
  () => {

    let component:
      FlightDetailComponent;

    let fixture:
      ComponentFixture<FlightDetailComponent>;

    let dialogRefSpy:any;

    const mockFlightData:
      FlightDetailsData = {

      id: 'AI102',

      aircraftType:
        'Boeing 787',

      departureAirport:
        'DEL',

      destinationAirport:
        'LHR',

      firRegion:
        'Mumbai FIR',

      altitude: 36000,

      speed: 840,

      status: 'Enroute',

      eta: '02:45 HRS',

      lastUpdated:
        '2026-05-12T10:30:00Z',
    };

    beforeEach(async () => {

      dialogRefSpy ={
        close : vi.fn()
      }

      await TestBed.configureTestingModule({

        imports: [
          FlightDetailComponent,
        ],

        providers: [

          {
            provide:
              MAT_DIALOG_DATA,

            useValue:
              mockFlightData,
          },

          {
            provide:
              MatDialogRef,

            useValue:
              dialogRefSpy,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          FlightDetailComponent
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

    // DATA

    it(
      'should receive flight data',
      () => {

        expect(
          component.data
        ).toEqual(
          mockFlightData
        );
      }
    );

    // FLIGHT ID

    it(
      'should contain flight id',
      () => {

        expect(
          component.data.id
        ).toBe('AI102');
      }
    );

    // AIRCRAFT

    it(
      'should contain aircraft type',
      () => {

        expect(
          component.data
            .aircraftType
        ).toBe(
          'Boeing 787'
        );
      }
    );

    // ROUTE

    it(
      'should contain departure and destination airports',
      () => {

        expect(
          component.data
            .departureAirport
        ).toBe('DEL');

        expect(
          component.data
            .destinationAirport
        ).toBe('LHR');
      }
    );

    // FIR REGION

    it(
      'should contain FIR region',
      () => {

        expect(
          component.data
            .firRegion
        ).toBe(
          'Mumbai FIR'
        );
      }
    );

    // ALTITUDE

    it(
      'should contain altitude',
      () => {

        expect(
          component.data
            .altitude
        ).toBe(36000);
      }
    );

    // SPEED

    it(
      'should contain speed',
      () => {

        expect(
          component.data
            .speed
        ).toBe(840);
      }
    );

    // STATUS

    it(
      'should contain flight status',
      () => {

        expect(
          component.data
            .status
        ).toBe(
          'Enroute'
        );
      }
    );

    // ETA

    it(
      'should contain ETA',
      () => {

        expect(
          component.data
            .eta
        ).toBe(
          '02:45 HRS'
        );
      }
    );

    // LAST UPDATED

    it(
      'should contain last updated timestamp',
      () => {

        expect(
          component.data
            .lastUpdated
        ).toContain(
          '2026'
        );
      }
    );

    // CLOSE

    it(
      'should close dialog',
      () => {

        component.close();

        expect(
          dialogRefSpy.close
        ).toHaveBeenCalled();
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

    // COMPONENT INSTANCE

    it(
      'should create component instance',
      () => {

        expect(component)
          instanceof
          FlightDetailComponent;
      }
    );
  }
);