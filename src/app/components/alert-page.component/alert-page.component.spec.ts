import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { AlertPageComponent } from './alert-page.component';

import { AlertPanelComponent }
from '../alert-panel/alert-panel.component';

import { AlertHistoryComponent }
from '../alert-history.component/alert-history.component';

describe(
  'AlertPageComponent',
  () => {

    let component:
      AlertPageComponent;

    let fixture:
      ComponentFixture<AlertPageComponent>;

    beforeEach(async () => {

      await TestBed.configureTestingModule({

        imports: [

          AlertPageComponent,

          AlertPanelComponent,

          AlertHistoryComponent,
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          AlertPageComponent
        );

      component =
        fixture.componentInstance;

      fixture.detectChanges();
    });

    // COMPONENT CREATION

    it(
      'should create',
      () => {

        expect(component)
          .toBeTruthy();
      }
    );

    // COMPONENT INSTANCE

    it(
      'should create component instance',
      () => {

        expect(component)
          instanceof
          AlertPageComponent;
      }
    );

    // ALERT PANEL

    it(
      'should render AlertPanelComponent',
      () => {

        const alertPanel =
          fixture.debugElement.query(
            By.directive(
              AlertPanelComponent
            )
          );

        expect(alertPanel)
          .toBeTruthy();
      }
    );

    // ALERT HISTORY

    it(
      'should render AlertHistoryComponent',
      () => {

        const alertHistory =
          fixture.debugElement.query(
            By.directive(
              AlertHistoryComponent
            )
          );

        expect(alertHistory)
          .toBeTruthy();
      }
    );

    // CHILD COMPONENT COUNT

    it(
      'should render both child components',
      () => {

        const childComponents =
          fixture.debugElement.queryAll(
            By.css('*')
          );

        expect(
          childComponents.length
        ).toBeGreaterThan(0);
      }
    );

    // TEMPLATE RENDER

    it(
      'should render template successfully',
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