import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';

import { vi } from 'vitest';

import {
  AlertHistoryComponent,
} from './alert-history.component';

import {
  AlertService,
  FlightAlert,
} from '../../services/alerts.service';

describe(
  'AlertHistoryComponent',
  () => {

    let component:
      AlertHistoryComponent;

    let fixture:
      ComponentFixture<AlertHistoryComponent>;

    let mockAlertService:
      any;

    const mockAlerts:
      FlightAlert[] = [

      {
        id: 1,
        flightId: 'AI101',
        message: 'High altitude drop',
        severity: 'HIGH',
        timestamp: new Date('2026-05-12T10:00:00Z'),
        type: 'ALTITUDE_DROP',
        isRead: false
      },

      {
        id: 2,
        flightId: 'UK202',
        message: 'Speed exceeded',
        severity: 'MEDIUM',
        timestamp: new Date('2026-05-12T11:00:00Z'),
        type: 'ALTITUDE_DROP',
        isRead: false
      },

      {
        id: 3,
        flightId: '6E303',
        message: 'Minor delay',
        severity: 'LOW',
        timestamp: new Date('2026-05-12T12:00:00Z'),
        type: 'ALTITUDE_DROP',
        isRead: false
      },
    ];

    beforeEach(async () => {

      mockAlertService = {

  alerts:
    signal(mockAlerts),
};

      await TestBed.configureTestingModule({

        imports: [
          AlertHistoryComponent,
        ],

        providers: [

          {
            provide:
              AlertService,

            useValue:
              mockAlertService,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          AlertHistoryComponent
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

    // ALERTS

    it(
      'should load alerts from service',
      () => {

        expect(
          component.alerts().length
        ).toBe(3);
      }
    );

    // DEFAULT FILTER

    it(
      'should return all alerts by default',
      () => {

        expect(
          component.filteredAlerts()
            .length
        ).toBe(3);
      }
    );

    // HIGH FILTER

    it(
      'should filter HIGH severity alerts',
      () => {

        component
          .setSeverityFilter(
            'HIGH'
          );

        expect(
          component.filteredAlerts()
            .length
        ).toBe(1);

        expect(
          component.filteredAlerts()[0]
            .severity
        ).toBe('HIGH');
      }
    );

    // MEDIUM FILTER

    it(
      'should filter MEDIUM severity alerts',
      () => {

        component
          .setSeverityFilter(
            'MEDIUM'
          );

        expect(
          component.filteredAlerts()
            .length
        ).toBe(1);

        expect(
          component.filteredAlerts()[0]
            .severity
        ).toBe('MEDIUM');
      }
    );

    // LOW FILTER

    it(
      'should filter LOW severity alerts',
      () => {

        component
          .setSeverityFilter(
            'LOW'
          );

        expect(
          component.filteredAlerts()
            .length
        ).toBe(1);

        expect(
          component.filteredAlerts()[0]
            .severity
        ).toBe('LOW');
      }
    );

    // RESET FILTER

    it(
      'should reset to ALL alerts',
      () => {

        component
          .setSeverityFilter(
            'ALL'
          );

        expect(
          component.filteredAlerts()
            .length
        ).toBe(3);
      }
    );

    // SIGNAL UPDATE

    it(
      'should update selectedSeverity signal',
      () => {

        component
          .setSeverityFilter(
            'HIGH'
          );

        expect(
          component.selectedSeverity()
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

    // DEFAULT CLASS

    it(
      'should return default severity-low class',
      () => {

        expect(
          component.getSeverityClass(
            'UNKNOWN'
          )
        ).toBe(
          'severity-low'
        );
      }
    );

    // TRACKBY

    it(
      'should track alerts by id',
      () => {

        const result =
          component.trackByAlertId(
            0,
            mockAlerts[0]
          );

        expect(result)
          .toBe(1);
      }
    );

    // EMPTY FILTER

    it(
      'should return empty array for unmatched severity',
      () => {

        component
          .setSeverityFilter(
            'CRITICAL'
          );

        expect(
          component.filteredAlerts()
            .length
        ).toBe(0);
      }
    );

    // TEMPLATE

    it(
      'should render component template',
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
  }
);