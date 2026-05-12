import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {
  expect,
  vi,
} from 'vitest';
import {
  AlertToastComponent,
  AlertToastData,
} from './alert-toast.component';

describe(
  'AlertToastComponent',
  () => {

    let component:
      AlertToastComponent;

    let fixture:
      ComponentFixture<AlertToastComponent>;

    let snackBarRefSpy:any;

    const mockData:
      AlertToastData = {

      flightId: 'AI102',

      message:
        'Sudden altitude drop detected.',

      severity: 'HIGH',
    };

    beforeEach(async () => {

      snackBarRefSpy ={
       dismiss:vi.fn()
      }

      await TestBed.configureTestingModule({

        imports: [
          AlertToastComponent,
        ],

        providers: [

          {
            provide:
              MAT_SNACK_BAR_DATA,

            useValue:
              mockData,
          },

          {
            provide:
              MatSnackBarRef,

            useValue:
              snackBarRefSpy,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          AlertToastComponent
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
      'should receive snackbar data',
      () => {

        expect(
          component.data
        ).toEqual(mockData);
      }
    );

    // CLOSE

    it(
      'should dismiss snackbar on close',
      () => {

        component.close();

        expect(
          snackBarRefSpy.dismiss
        ).toHaveBeenCalled();
      }
    );

    // HIGH CLASS

    it(
      'should return toast-high class',
      () => {

        component.data.severity =
          'HIGH';

        expect(
          component.getToastClass()
        ).toBe(
          'toast-high'
        );
      }
    );

    // MEDIUM CLASS

    it(
      'should return toast-medium class',
      () => {

        component.data.severity =
          'MEDIUM';

        expect(
          component.getToastClass()
        ).toBe(
          'toast-medium'
        );
      }
    );

    // LOW CLASS

    it(
      'should return toast-low class',
      () => {

        component.data.severity =
          'LOW';

        expect(
          component.getToastClass()
        ).toBe(
          'toast-low'
        );
      }
    );

    // DEFAULT CLASS

    it(
      'should return default toast-low class',
      () => {

        expect(
          component.getToastClass()
        ).toBe(
          'toast-low'
        );
      }
    );

    // HIGH ICON

    it(
      'should return warning icon',
      () => {

        component.data.severity =
          'HIGH';

        expect(
          component.getIcon()
        ).toBe(
          'warning'
        );
      }
    );

    // MEDIUM ICON

    it(
      'should return speed icon',
      () => {

        component.data.severity =
          'MEDIUM';

        expect(
          component.getIcon()
        ).toBe(
          'speed'
        );
      }
    );

    // LOW ICON

    it(
      'should return info icon',
      () => {

        component.data.severity =
          'LOW';

        expect(
          component.getIcon()
        ).toBe(
          'info'
        );
      }
    );

    // DEFAULT ICON

    it(
      'should return notifications icon',
      () => {

        component.data.severity =
          'UNKNOWN' as any;

        expect(
          component.getIcon()
        ).toBe(
          'notifications'
        );
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

    // FLIGHT ID

    it(
      'should contain flight id',
      () => {

        expect(
          component.data.flightId
        ).toBe('AI102');
      }
    );

    // MESSAGE

    it(
      'should contain alert message',
      () => {

        expect(
          component.data.message
        ).toContain(
          'altitude'
        );
      }
    );
  }
);