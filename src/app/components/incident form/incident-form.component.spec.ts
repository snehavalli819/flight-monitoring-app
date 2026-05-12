import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import {
  Router,
} from '@angular/router';

import {
  of,
} from 'rxjs';

import {
  IncidentFormComponent,
} from './incident-form.component';

import {
  IncidentService,
} from '../../services/incident.service';

describe(
  'IncidentFormComponent',
  () => {

    let component:
      IncidentFormComponent;

    let fixture:
      ComponentFixture<IncidentFormComponent>;

    let incidentServiceSpy:
      any;

    let routerSpy:
      any;

    beforeEach(async () => {

      incidentServiceSpy ={
        
          addIncident:vi.fn()
      };

      routerSpy = { navigate : vi.fn()}

      routerSpy.navigate
        .mockReturnValue(
          Promise.resolve(true)
        );

      await TestBed.configureTestingModule({

        imports: [

          IncidentFormComponent,

          NoopAnimationsModule,
        ],

        providers: [

          {
            provide:
              IncidentService,

            useValue:
              incidentServiceSpy,
          },

          {
            provide:
              Router,

            useValue:
              routerSpy,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          IncidentFormComponent
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
      'should initialize form',
      () => {

        expect(
          component.incidentForm
        ).toBeTruthy();
      }
    );

    it(
      'should initialize severity levels',
      () => {

        expect(
          component.severityLevels
            .length
        ).toBe(3);
      }
    );

    it(
      'should initialize incident types',
      () => {

        expect(
          component.incidentTypes
            .length
        ).toBe(5);
      }
    );

    it(
      'should initialize teams',
      () => {

        expect(
          component.teams.length
        ).toBe(4);
      }
    );

    it(
      'should validate required fields',
      () => {

        expect(
          component.incidentForm.invalid
        ).toBeTruthy();
      }
    );

    it(
      'should validate description minlength',
      () => {

        component.incidentForm
          .get('description')
          ?.setValue('short');

        expect(
          component
            .incidentForm
            .get('description')
            ?.invalid
        ).toBeTruthy();
      }
    );

    it(
      'should detect high severity',
      () => {

        component.incidentForm
          .get('severity')
          ?.setValue('HIGH');

        expect(
          component
            .isHighSeverity()
        ).toBeTruthy();
      }
    );

    it(
      'should detect communication failure',
      () => {

        component.incidentForm
          .get('incidentType')
          ?.setValue(
            'Communication Failure'
          );

        expect(
          component
            .isCommunicationFailure()
        ).toBeTruthy();
      }
    );

    it(
      'should add assignedTeam validator for HIGH severity',
      () => {

        component.incidentForm
          .get('severity')
          ?.setValue('HIGH');

        const control =
          component.incidentForm.get(
            'assignedTeam'
          );

        control?.setValue('');

        expect(
          control?.invalid
        ).toBeTruthy();
      }
    );

    it(
      'should remove assignedTeam validator for LOW severity',
      () => {

        component.incidentForm
          .get('severity')
          ?.setValue('LOW');

        const control =
          component.incidentForm.get(
            'assignedTeam'
          );

        control?.setValue('');

        expect(
          control?.valid
        ).toBeTruthy();
      }
    );

    it(
      'should add communication validators',
      () => {

        component.incidentForm
          .get('incidentType')
          ?.setValue(
            'Communication Failure'
          );

        const frequency =
          component.incidentForm.get(
            'communicationFrequency'
          );

        frequency?.setValue('');

        expect(
          frequency?.invalid
        ).toBeTruthy();
      }
    );

    it(
      'should remove communication validators',
      () => {

        component.incidentForm
          .get('incidentType')
          ?.setValue(
            'Engine Issue'
          );

        const frequency =
          component.incidentForm.get(
            'communicationFrequency'
          );

        frequency?.setValue('');

        expect(
          frequency?.valid
        ).toBeTruthy();
      }
    );

    it(
      'should return null for valid past date',
      () => {

        const yesterday =
          new Date();

        yesterday.setDate(
          yesterday.getDate() - 1
        );

        const result =
          component.pastDateValidatorFn({
            value: yesterday,
          });

        expect(result)
          .toBeNull();
      }
    );

    it(
      'should return error for future date',
      () => {

        const tomorrow =
          new Date();

        tomorrow.setDate(
          tomorrow.getDate() + 1
        );

        const result =
          component.pastDateValidatorFn({
            value: tomorrow,
          });

        expect(result)
          .toEqual({
            notPastDate: true,
          });
      }
    );

    it(
      'should return null when validator value empty',
      () => {

        const result =
          component.pastDateValidatorFn({
            value: '',
          });

        expect(result)
          .toBeNull();
      }
    );

    it(
      'should not submit invalid form',
      () => {

        component.submitIncident();

        expect(
          incidentServiceSpy
            .addIncident
        ).not.toHaveBeenCalled();
      }
    );

    it(
  'should submit valid form',
  () => {

    incidentServiceSpy
      .addIncident
      .mockImplementation(
        vi.fn()
      );

    component.incidentForm
      .patchValue({

        flightId: 'AI102',

        incidentType:
          'Technical Failure',

        severity: 'HIGH',

        description:
          'Engine issue detected during flight operations.',

        timestamp:
          new Date()
            .toISOString(),

        assignedTeam:
          'Engineering Team',
      });

    fixture.detectChanges();

    expect(
      component.incidentForm.valid
    ).toBeTruthy();

    component.submitIncident();

    expect(
      incidentServiceSpy
        .addIncident
    ).toHaveBeenCalled();
  }
);

    it(
      'should reset form',
      () => {

        component.incidentForm
          .patchValue({

            flightId: 'AI102',
          });

        component.resetForm();

        expect(
          component.incidentForm
            .get('flightId')
            ?.value
        ).toBeNull();
      }
    );

    it(
      'should set submitted false on reset',
      () => {

        component.submitted.set(true);

        component.resetForm();

        expect(
          component.submitted()
        ).toBeFalsy();
      }
    );

    it(
      'should detect form errors',
      () => {

        const control =
          component.incidentForm.get(
            'flightId'
          );

        control?.markAsTouched();

        expect(
          component.hasError(
            'flightId'
          )
        ).toBeTruthy();
      }
    );

    it(
      'should return false for valid control',
      () => {

        component.incidentForm
          .get('flightId')
          ?.setValue('AI102');

        expect(
          component.hasError(
            'flightId'
          )
        ).toBeFalsy();
      }
    );

    it(
      'should execute ngOnDestroy',
      () => {

        expect(() =>
          component.ngOnDestroy()
        ).not.toThrow();
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
  }
);