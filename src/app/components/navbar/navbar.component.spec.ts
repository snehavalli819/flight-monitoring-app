import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { signal } from '@angular/core';

import {
  RouterTestingModule,
} from '@angular/router/testing';

import {
  NavbarComponent,
} from './navbar.component';
import { vi } from 'vitest';
import {
  AuthService,
} from '../../services/auth.service';

describe(
  'NavbarComponent',
  () => {

    let component:
      NavbarComponent;

    let fixture:
      ComponentFixture<NavbarComponent>;

    let authServiceSpy:any;

    beforeEach(async () => {

      authServiceSpy = {

  logout: vi.fn(),

  userRole:
    signal(
      'Supervisor'
    ),

  isAuthenticated:
    signal(true),

  currentUser:
    signal({

      name:
        'Sneha',

      role:
        'Supervisor',
    }),
};

      await TestBed.configureTestingModule({

        imports: [

          NavbarComponent,

          RouterTestingModule,
        ],

        providers: [

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
          NavbarComponent
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

    // SIDEBAR SIGNAL

    it(
      'should initialize sidebar as false',
      () => {

        expect(
          component
            .sidebarOpened()
        ).toBeFalsy();
      }
    );

    // ALERT COUNT

    it(
      'should initialize alert count',
      () => {

        expect(
          component.alertCount()
        ).toBe(12);
      }
    );

    // CURRENT ROLE

    it(
      'should expose current role',
      () => {

        expect(
          component.currentRole()
        ).toBe(
          'Supervisor'
        );
      }
    );

    // AUTHENTICATION

    it(
      'should expose authentication status',
      () => {

        expect(
          component
            .isAuthenticated()
        ).toBeTruthy();
      }
    );

    // CURRENT USER

    it(
      'should expose current user',
      () => {

        expect(
          component.currentUser()
            ?.name
        ).toBe('Sneha');
      }
    );

    // NAV ITEMS

    it(
      'should initialize nav items',
      () => {

        expect(
          component.navItems
            .length
        ).toBe(6);
      }
    );

    // DASHBOARD ITEM

    it(
      'should contain dashboard nav item',
      () => {

        expect(
          component.navItems[0]
            .label
        ).toBe(
          'Dashboard'
        );

        expect(
          component.navItems[0]
            .route
        ).toBe('/');
      }
    );

    // FLIGHTS ITEM

    it(
      'should contain flights nav item',
      () => {

        expect(
          component.navItems[1]
            .route
        ).toBe(
          '/flights'
        );
      }
    );

    // MAP ITEM

    it(
      'should contain live tracking nav item',
      () => {

        expect(
          component.navItems[2]
            .route
        ).toBe('/map');
      }
    );

    // ALERTS ITEM

    it(
      'should contain alerts nav item',
      () => {

        expect(
          component.navItems[3]
            .route
        ).toBe(
          '/alerts'
        );
      }
    );

    // INCIDENTS ITEM

    it(
      'should contain incidents nav item',
      () => {

        expect(
          component.navItems[4]
            .route
        ).toBe(
          '/incidents'
        );
      }
    );

    // USERS ITEM

    it(
      'should contain users nav item',
      () => {

        expect(
          component.navItems[5]
            .route
        ).toBe(
          '/users'
        );
      }
    );

    // TOGGLE SIDEBAR

    it(
      'should toggle sidebar',
      () => {

        component.toggleSidebar();

        expect(
          component
            .sidebarOpened()
        ).toBeTruthy();

        component.toggleSidebar();

        expect(
          component
            .sidebarOpened()
        ).toBeFalsy();
      }
    );

    // TRACKBY

    it(
      'should track by label',
      () => {

        const result =
          component.trackByLabel(

            0,

            component.navItems[0]
          );

        expect(result)
          .toBe(
            'Dashboard'
          );
      }
    );

    // LOGOUT

    it(
      'should logout',
      () => {

        component.logout();

        expect(
          authServiceSpy.logout
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

    // NAV ITEMS LABELS

    it(
      'should contain correct nav labels',
      () => {

        const labels =
          component.navItems.map(
            (item) =>
              item.label
          );

        expect(labels)
          .toContain(
            'Dashboard'
          );

        expect(labels)
          .toContain(
            'Flights'
          );

        expect(labels)
          .toContain(
            'Alerts'
          );
      }
    );

    // ICONS

    it(
      'should contain icons in nav items',
      () => {

        expect(
          component.navItems[0]
            .icon
        ).toBe(
          'dashboard'
        );

        expect(
          component.navItems[1]
            .icon
        ).toBe(
          'flight'
        );
      }
    );
  }
);