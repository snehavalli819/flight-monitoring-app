import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';

import {
  IncidentHistoryComponent,
} from './incident-history.component';

import {
  IncidentService,
  Incident,
} from '../../services/incident.service';

import {
  AuthService,
} from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe(
  'IncidentHistoryComponent',
  () => {

    let component:
      IncidentHistoryComponent;

    let fixture:
      ComponentFixture<IncidentHistoryComponent>;

    let incidentServiceSpy:
      any;

    let authServiceSpy:
      any;

    const mockIncidents:
      Incident[] = [

      {
        id: 1,

        flightId: 'AI102',

        incidentType:
          'Technical Failure',

        severity: 'HIGH',

        description:
          'Engine vibration detected.',

        timestamp:
          '2026-05-12T10:00:00Z',

        assignedTeam:
          'Engineering Team',

        reportedBy:
          'Controller',

        status: 'Open',
      },

      {
        id: 2,

        flightId: 'UK221',

        incidentType:
          'Communication Failure',

        severity: 'MEDIUM',

        description:
          'Signal loss detected.',

        timestamp:
          '2026-05-12T11:00:00Z',

        assignedTeam:
          'ATC Team',

        reportedBy:
          'Supervisor',

        status: 'Resolved',
      },

      {
        id: 3,

        flightId: '6E990',

        incidentType:
          'Weather Impact',

        severity: 'LOW',

        description:
          'Minor weather delay.',

        timestamp:
          '2026-05-12T12:00:00Z',

        assignedTeam:
          'Operations Team',

        reportedBy:
          'Controller',

        status: 'In Progress',
      },
    ];

    beforeEach(async () => {

      incidentServiceSpy = {

  updateIncidentStatus:
    vi.fn(),

  deleteIncident:
    vi.fn(),

  incidents:
    signal(
      mockIncidents
    ),
};
authServiceSpy = {

  canEdit:
    vi.fn(),

  hasFullAccess:
    vi.fn(),
};
    
authServiceSpy.canEdit
        .mockReturnValue(true);

      authServiceSpy
        .hasFullAccess
        .mockReturnValue(true);

      await TestBed.configureTestingModule({

        imports: [
          IncidentHistoryComponent,
          RouterTestingModule
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
              AuthService,

            useValue:
              authServiceSpy,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          IncidentHistoryComponent
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

    // INCIDENTS

    it(
      'should load incidents',
      () => {

        expect(
          component.incidents()
            .length
        ).toBe(3);
      }
    );

    // DEFAULT FILTER

    it(
      'should return all incidents by default',
      () => {

        expect(
          component
            .filteredIncidents()
            .length
        ).toBe(3);
      }
    );

    // HIGH FILTER

    it(
      'should filter HIGH severity incidents',
      () => {

        component.setSeverity(
          'HIGH'
        );

        expect(
          component
            .filteredIncidents()
            .length
        ).toBe(1);

        expect(
          component
            .filteredIncidents()[0]
            .severity
        ).toBe('HIGH');
      }
    );

    // MEDIUM FILTER

    it(
      'should filter MEDIUM severity incidents',
      () => {

        component.setSeverity(
          'MEDIUM'
        );

        expect(
          component
            .filteredIncidents()
            .length
        ).toBe(1);

        expect(
          component
            .filteredIncidents()[0]
            .severity
        ).toBe('MEDIUM');
      }
    );

    // LOW FILTER

    it(
      'should filter LOW severity incidents',
      () => {

        component.setSeverity(
          'LOW'
        );

        expect(
          component
            .filteredIncidents()
            .length
        ).toBe(1);

        expect(
          component
            .filteredIncidents()[0]
            .severity
        ).toBe('LOW');
      }
    );

    // UPDATE STATUS

    it(
      'should update incident status',
      () => {

        component.updateStatus(

          mockIncidents[0],

          'Resolved'
        );

        expect(
          incidentServiceSpy
            .updateIncidentStatus
        ).toHaveBeenCalledWith(
          1,
          'Resolved'
        );
      }
    );

    // DELETE

    it(
      'should delete incident',
      () => {

        component.deleteIncident(
          mockIncidents[0]
        );

        expect(
          incidentServiceSpy
            .deleteIncident
        ).toHaveBeenCalledWith(
          1
        );
      }
    );

    // SET FILTER

    it(
      'should set severity filter',
      () => {

        component.setSeverity(
          'HIGH'
        );

        expect(
          component
            .selectedSeverity()
        ).toBe('HIGH');
      }
    );

    // HIGH CLASS

    it(
      'should return severity-high class',
      () => {

        expect(
          component.getSeverityClass(
            'HIGH'
          )
        ).toBe(
          'severity-high'
        );
      }
    );

    // MEDIUM CLASS

    it(
      'should return severity-medium class',
      () => {

        expect(
          component.getSeverityClass(
            'MEDIUM'
          )
        ).toBe(
          'severity-medium'
        );
      }
    );

    // LOW CLASS

    it(
      'should return severity-low class',
      () => {

        expect(
          component.getSeverityClass(
            'LOW'
          )
        ).toBe(
          'severity-low'
        );
      }
    );

    // DEFAULT SEVERITY CLASS

    it(
      'should return empty severity class',
      () => {

        expect(
          component.getSeverityClass(
            'UNKNOWN'
          )
        ).toBe('');
      }
    );

    // OPEN STATUS

    it(
      'should return status-open class',
      () => {

        expect(
          component.getStatusClass(
            'Open'
          )
        ).toBe(
          'status-open'
        );
      }
    );

    // PROGRESS STATUS

    it(
      'should return status-progress class',
      () => {

        expect(
          component.getStatusClass(
            'In Progress'
          )
        ).toBe(
          'status-progress'
        );
      }
    );

    // RESOLVED STATUS

    it(
      'should return status-resolved class',
      () => {

        expect(
          component.getStatusClass(
            'Resolved'
          )
        ).toBe(
          'status-resolved'
        );
      }
    );

    // DEFAULT STATUS

    it(
      'should return empty status class',
      () => {

        expect(
          component.getStatusClass(
            'UNKNOWN'
          )
        ).toBe('');
      }
    );

    // TRACKBY

    it(
      'should track incident by id',
      () => {

        const result =
          component.trackByIncidentId(
            0,
            mockIncidents[0]
          );

        expect(result)
          .toBe(1);
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

    // EMPTY FILTER RESULT

    it(
      'should return empty array for unmatched severity',
      () => {

        component.setSeverity(
          'CRITICAL'
        );

        expect(
          component
            .filteredIncidents()
            .length
        ).toBe(0);
      }
    );
  }
);