import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';

import {
  AlertPanelComponent,
} from './alert-panel.component';

import {
  AlertService,
  FlightAlert,
} from '../../services/alerts.service';

describe(
  'AlertPanelComponent',
  () => {

    let component:
      AlertPanelComponent;

    let fixture:
      ComponentFixture<AlertPanelComponent>;

    let mockAlertService:
      any;

    const mockAlerts:
      FlightAlert[] = [

      {
        id: 1,

        flightId: 'AI102',

        type: 'ALTITUDE_DROP',

        severity: 'HIGH',

        message:
          'Sudden altitude drop detected.',

        timestamp:
          new Date('2026-05-12T10:00:00Z'),

        isRead: false,
      },

      {
        id: 2,

        flightId: 'UK221',

        type: 'SPEED_EXCEEDED',

        severity: 'MEDIUM',

        message:
          'Speed threshold exceeded.',

        timestamp:
          new Date('2026-05-12T11:00:00Z'),

        isRead: false,
      },

      {
        id: 3,

        flightId: '6E990',

        type: 'DELAY',

        severity: 'LOW',

        message:
          'Flight delayed more than 30 mins.',

        timestamp:
          new Date('2026-05-12T12:00:00Z'),

        isRead: true,
      },
    ];

    beforeEach(async () => {

      mockAlertService = {

  generateAlert:
    vi.fn(),

  markAsRead:
    vi.fn(),

  clearAlert:
    vi.fn(),

  clearAll:
    vi.fn(),

  alerts:
    signal(mockAlerts),

  alertCount:
    signal(
      mockAlerts.length
    ),
};

      await TestBed.configureTestingModule({

        imports: [
          AlertPanelComponent,
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
          AlertPanelComponent
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
      'should load alerts',
      () => {

        expect(
          component.alerts()
            .length
        ).toBe(3);
      }
    );

    // ALERT COUNT

    it(
      'should return alert count',
      () => {

        expect(
          component.alertCount()
        ).toBe(3);
      }
    );

    // CRITICAL ALERTS

    it(
      'should return only HIGH severity alerts',
      () => {

        expect(
          component
            .criticalAlerts()
            .length
        ).toBe(1);

        expect(
          component
            .criticalAlerts()[0]
            .severity
        ).toBe('HIGH');
      }
    );

    // GENERATE MOCK ALERTS

    it(
      'should generate mock alerts on init',
      () => {

        expect(
          mockAlertService
            .generateAlert
        ).toHaveBeenCalledTimes(3);
      }
    );

    // HIGH CLASS

    it(
      'should return high-alert class',
      () => {

        expect(
          component.getAlertClass(
            'HIGH'
          )
        ).toBe(
          'high-alert'
        );
      }
    );

    // MEDIUM CLASS

    it(
      'should return medium-alert class',
      () => {

        expect(
          component.getAlertClass(
            'MEDIUM'
          )
        ).toBe(
          'medium-alert'
        );
      }
    );

    // LOW CLASS

    it(
      'should return low-alert class',
      () => {

        expect(
          component.getAlertClass(
            'LOW'
          )
        ).toBe(
          'low-alert'
        );
      }
    );

    // DEFAULT CLASS

    it(
      'should return default low-alert class',
      () => {

        expect(
          component.getAlertClass(
            'UNKNOWN'
          )
        ).toBe(
          'low-alert'
        );
      }
    );

    // ALTITUDE ICON

    it(
      'should return trending_down icon',
      () => {

        expect(
          component.getAlertIcon(
            'ALTITUDE_DROP'
          )
        ).toBe(
          'trending_down'
        );
      }
    );

    // SPEED ICON

    it(
      'should return speed icon',
      () => {

        expect(
          component.getAlertIcon(
            'SPEED_EXCEEDED'
          )
        ).toBe(
          'speed'
        );
      }
    );

    // DELAY ICON

    it(
      'should return schedule icon',
      () => {

        expect(
          component.getAlertIcon(
            'DELAY'
          )
        ).toBe(
          'schedule'
        );
      }
    );

    // DEFAULT ICON

    it(
      'should return warning icon',
      () => {

        expect(
          component.getAlertIcon(
            'UNKNOWN'
          )
        ).toBe(
          'warning'
        );
      }
    );

    // MARK AS READ

    it(
      'should mark alert as read',
      () => {

        component.markAsRead(
          mockAlerts[0]
        );

        expect(
          mockAlertService
            .markAsRead
        ).toHaveBeenCalledWith(
          1
        );
      }
    );

    // CLEAR ALERT

    it(
      'should clear alert',
      () => {

        component.clearAlert(1);

        expect(
          mockAlertService
            .clearAlert
        ).toHaveBeenCalledWith(
          1
        );
      }
    );

    // CLEAR ALL

    it(
      'should clear all alerts',
      () => {

        component.clearAll();

        expect(
          mockAlertService
            .clearAll
        ).toHaveBeenCalled();
      }
    );

    // TRACK BY

    it(
      'should track alert by id',
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
  }
);