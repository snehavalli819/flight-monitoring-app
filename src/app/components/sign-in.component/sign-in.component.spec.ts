import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import {
  Router,
} from '@angular/router';

import {
  SigninComponent,
} from './sign-in.component';

import {
  AuthService,
} from '../../services/auth.service';

describe(
  'SigninComponent',
  () => {

    let component:
      SigninComponent;

    let fixture:
      ComponentFixture<SigninComponent>;

    let authServiceSpy:
      any;
    let routerSpy:
      any;

    beforeEach(async () => {

      authServiceSpy ={
        login: vi.fn(),
      }

      routerSpy ={
       navigate:vi.fn(),
      }
      await TestBed.configureTestingModule({

        imports: [
          SigninComponent,
        ],

        providers: [

          {
            provide:
              AuthService,

            useValue:
              authServiceSpy,
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
          SigninComponent
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

    // FORM

    it(
      'should initialize signin form',
      () => {

        expect(
          component.signinForm
        ).toBeTruthy();
      }
    );

    // EMAIL CONTROL

    it(
      'should contain email control',
      () => {

        expect(
          component.signinForm.get(
            'email'
          )
        ).toBeTruthy();
      }
    );

    // PASSWORD CONTROL

    it(
      'should contain password control',
      () => {

        expect(
          component.signinForm.get(
            'password'
          )
        ).toBeTruthy();
      }
    );

    // INITIAL PASSWORD STATE

    it(
      'should initialize hidePassword as true',
      () => {

        expect(
          component.hidePassword()
        ).toBeTruthy();
      }
    );

    // TOGGLE PASSWORD

    it(
      'should toggle password visibility',
      () => {

        component.togglePassword();

        expect(
          component.hidePassword()
        ).toBeFalsy();

        component.togglePassword();

        expect(
          component.hidePassword()
        ).toBeTruthy();
      }
    );

    // INVALID FORM

    it(
      'should invalidate empty form',
      () => {

        expect(
          component.signinForm.invalid
        ).toBeTruthy();
      }
    );

    // REQUIRED EMAIL

    it(
      'should validate required email',
      () => {

        const control =
          component.signinForm.get(
            'email'
          );

        control?.setValue('');

        expect(
          control?.invalid
        ).toBeTruthy();
      }
    );

    // EMAIL FORMAT

    it(
      'should validate email format',
      () => {

        const control =
          component.signinForm.get(
            'email'
          );

        control?.setValue(
          'invalid-email'
        );

        expect(
          control?.invalid
        ).toBeTruthy();
      }
    );

    // REQUIRED PASSWORD

    it(
      'should validate required password',
      () => {

        const control =
          component.signinForm.get(
            'password'
          );

        control?.setValue('');

        expect(
          control?.invalid
        ).toBeTruthy();
      }
    );

    // VALID FORM

    it(
      'should validate correct form',
      () => {

        component.signinForm
          .patchValue({

            email:
              'test@test.com',

            password:
              'password123',
          });

        expect(
          component.signinForm.valid
        ).toBeTruthy();
      }
    );

    // INVALID LOGIN

    it(
      'should not login with invalid form',
      () => {

        component.login();

        expect(
          authServiceSpy.login
        ).not.toHaveBeenCalled();
      }
    );

    // SUCCESS LOGIN

    it(
      'should login successfully',
      () => {

        authServiceSpy.login
          .mockReturnValue(true);

        component.signinForm
          .patchValue({

            email:
              'test@test.com',

            password:
              'password123',
          });

        component.login();

        expect(
          authServiceSpy.login
        ).toHaveBeenCalledWith(

          'test@test.com',

          'password123'
        );

        expect(
          routerSpy.navigate
        ).toHaveBeenCalledWith([
          '/dashboard',
        ]);
      }
    );

    // FAILED LOGIN

    it(
      'should show error for invalid credentials',
      () => {

        authServiceSpy.login
          .mockReturnValue(false);

        component.signinForm
          .patchValue({

            email:
              'wrong@test.com',

            password:
              'wrongpass',
          });

        component.login();

        expect(
          component.loginError()
        ).toBe(
          'Invalid credentials'
        );
      }
    );

    // CLEAR LOGIN ERROR

    it(
      'should clear login error before login',
      () => {

        component.loginError.set(
          'Some Error'
        );

        authServiceSpy.login.mockReturnValue(
  false
);

        component.signinForm
          .patchValue({

            email:
              'test@test.com',

            password:
              '123456',
          });

        component.login();

        expect(
          component.loginError()
        ).toBe(
          'Invalid credentials'
        );
      }
    );

    // MARK TOUCHED

    it(
      'should mark form touched when invalid',
      () => {

        component.login();

        expect(
          component.signinForm.touched
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

    // LOGIN ERROR INITIAL

    it(
      'should initialize loginError empty',
      () => {

        expect(
          component.loginError()
        ).toBe('');
      }
    );

    // FORM RAW VALUE

    it(
      'should get raw form values',
      () => {

        component.signinForm
          .patchValue({

            email:
              'admin@test.com',

            password:
              'admin123',
          });

        const values =
          component.signinForm
            .getRawValue();

        expect(
          values.email
        ).toBe(
          'admin@test.com'
        );

        expect(
          values.password
        ).toBe(
          'admin123'
        );
      }
    );
  }
);