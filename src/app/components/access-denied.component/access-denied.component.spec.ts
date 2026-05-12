import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { RouterTestingModule }
from '@angular/router/testing';

import {
  AccessDeniedComponent,
} from './access-denied.component';

describe(
  'AccessDeniedComponent',
  () => {

    let component:
      AccessDeniedComponent;

    let fixture:
      ComponentFixture<AccessDeniedComponent>;

    beforeEach(async () => {

      await TestBed.configureTestingModule({

        imports: [

          AccessDeniedComponent,

          RouterTestingModule,
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          AccessDeniedComponent
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
          AccessDeniedComponent;
      }
    );

    // TEMPLATE

    it(
      'should render denied page container',
      () => {

        const container =
          fixture.nativeElement.querySelector(
            '.denied-page'
          );

        expect(container)
          .toBeTruthy();
      }
    );

    // CARD

    it(
      'should render denied card',
      () => {

        const card =
          fixture.nativeElement.querySelector(
            '.denied-card'
          );

        expect(card)
          .toBeTruthy();
      }
    );

    // 403 TITLE

    it(
      'should render 403 heading',
      () => {

        const heading =
          fixture.nativeElement.querySelector(
            'h1'
          );

        expect(
          heading.textContent
        ).toContain('403');
      }
    );

    // ACCESS DENIED TITLE

    it(
      'should render access denied text',
      () => {

        const title =
          fixture.nativeElement.querySelector(
            'h2'
          );

        expect(
          title.textContent
        ).toContain(
          'Access Denied'
        );
      }
    );

    // DESCRIPTION

    it(
      'should render description paragraph',
      () => {

        const paragraph =
          fixture.nativeElement.querySelector(
            'p'
          );

        expect(
          paragraph.textContent
        ).toContain(
          'You do not have permission'
        );
      }
    );

    // BUTTON

    it(
      'should render back button',
      () => {

        const button =
          fixture.nativeElement.querySelector(
            'button'
          );

        expect(button)
          .toBeTruthy();
      }
    );

    // BUTTON TEXT

    it(
      'should render correct button text',
      () => {

        const button =
          fixture.nativeElement.querySelector(
            'button'
          );

        expect(
          button.textContent
        ).toContain(
          'Back To Dashboard'
        );
      }
    );

    // ROUTER LINK

    it(
      'should contain dashboard routerLink',
      () => {

        const buttonDebug =
          fixture.debugElement.query(
            By.css('button')
          );

        const routerLink =
          buttonDebug.attributes[
            'ng-reflect-router-link'
          ];

        expect(routerLink)
          .toContain(
            '/dashboard'
          );
      }
    );

    // CHANGE DETECTION

    it(
      'should run change detection',
      () => {

        fixture.detectChanges();

        expect(component)
          .toBeDefined();
      }
    );

    // DOM VALIDATION

    it(
      'should render exactly one button',
      () => {

        const buttons =
          fixture.nativeElement.querySelectorAll(
            'button'
          );

        expect(
          buttons.length
        ).toBe(1);
      }
    );

    // CSS VALIDATION

    it(
      'should apply denied-card class',
      () => {

        const card =
          fixture.debugElement.query(
            By.css('.denied-card')
          );

        expect(card)
          .toBeTruthy();
      }
    );
  }
);