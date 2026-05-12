import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import {
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import {
  MatDialog,
} from '@angular/material/dialog';

import {
  debounceTime,
  of,
  throwError,
} from 'rxjs';

import {
  UsersComponent,
  User,
} from './users.component';

describe(
  'UsersComponent',
  () => {

    let component:
      UsersComponent;

    let fixture:
      ComponentFixture<UsersComponent>;

    let dialogSpy:
      any;

    const mockUser:
      User = {

      id: 1,

      name: 'John Carter',

      email:
        'john.carter@airnav.com',

      role: 'Supervisor',

      status: 'Active',

      lastLogin:
        '11 May 2026, 10:22 AM',
    };

    beforeEach(async () => {

      dialogSpy =
        {
          open: vi.fn(),
        };

      await TestBed.configureTestingModule({

        imports: [

          UsersComponent,

          NoopAnimationsModule,
        ],

        providers: [

          {
            provide:
              MatDialog,

            useValue:
              dialogSpy,
          },
        ],

      }).compileComponents();

      fixture =
        TestBed.createComponent(
          UsersComponent
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

    // DISPLAYED COLUMNS

    it(
      'should initialize displayed columns',
      () => {

        expect(
          component.displayedColumns
        ).toEqual([

          'user',
          'role',
          'status',
          'lastLogin',
          'actions',
        ]);
      }
    );

    // USERS

    it(
      'should initialize users',
      () => {

        expect(
          component.users()
            .length
        ).toBe(3);
      }
    );

    // SEARCH CONTROL

    it(
      'should initialize search control',
      () => {

        expect(
          component.searchControl.value
        ).toBe('');
      }
    );

    // FILTER ALL USERS

    it(
      'should return all users initially',
      () => {

        expect(
          component
            .filteredUsers()
            .length
        ).toBe(3);
      }
    );

    // SEARCH USER

    it(
      'should filter users by search term',
      (async() => {

        component.searchControl
          .setValue('John');

        await new Promise(resolve => setTimeout(resolve, 400));

        fixture.detectChanges();

        expect(
          component
            .filteredUsers()
            .length
        ).toBe(1);
      })
    );

    // FILTER ROLE

    it(
      'should filter users by role',
      () => {

        component.updateRole(
          'Supervisor'
        );

        expect(
          component
            .filteredUsers()
            .length
        ).toBe(1);
      }
    );

    // UPDATE ROLE

    it(
      'should update selected role',
      () => {

        component.updateRole(
          'Viewer'
        );

        expect(
          component.selectedRole()
        ).toBe('Viewer');
      }
    );

    // ROLE CLASS SUPERVISOR

    it(
      'should return supervisor class',
      () => {

        expect(
          component.getRoleClass(
            'Supervisor'
          )
        ).toBe(
          'role-supervisor'
        );
      }
    );

    // ROLE CLASS CONTROLLER

    it(
      'should return controller class',
      () => {

        expect(
          component.getRoleClass(
            'Controller'
          )
        ).toBe(
          'role-controller'
        );
      }
    );

    // ROLE CLASS VIEWER

    it(
      'should return viewer class',
      () => {

        expect(
          component.getRoleClass(
            'Viewer'
          )
        ).toBe(
          'role-viewer'
        );
      }
    );

    // ROLE CLASS DEFAULT

    it(
      'should return empty class for unknown role',
      () => {

        expect(
          component.getRoleClass(
            'Unknown'
          )
        ).toBe('');
      }
    );

    // STATUS ACTIVE

    it(
      'should return active status class',
      () => {

        expect(
          component.getStatusClass(
            'Active'
          )
        ).toBe(
          'status-active'
        );
      }
    );

    // STATUS INACTIVE

    it(
      'should return inactive status class',
      () => {

        expect(
          component.getStatusClass(
            'Inactive'
          )
        ).toBe(
          'status-inactive'
        );
      }
    );

    // EDIT USER

    it(
      'should open edit dialog',
      () => {

        dialogSpy.open.mockReturnValue({

          afterClosed: () =>
            of(null),

        } as any);

        component.editUser(
          mockUser
        );

        expect(
          dialogSpy.open
        ).toHaveBeenCalled();
      }
    );

    // EDIT USER UPDATE

    it(
      'should update user after dialog close',
      () => {

        dialogSpy.open.mockReturnValue({

          afterClosed: () =>
            of({

              ...mockUser,

              name:
                'Updated Name',
            }),

        } as any);

        component.editUser(
          mockUser
        );

        expect(
          component.users()[0]
            .name
        ).toBe(
          'Updated Name'
        );
      }
    );

    // EDIT USER ERROR

    it(
      'should handle dialog open error',
      () => {

        spyOn(
          console,
          'warn'
        );

        dialogSpy.open.throwError(
          'Dialog Error'
        );

        component.editUser(
          mockUser
        );

        expect(
          console.warn
        ).toHaveBeenCalled();
      }
    );

    // DELETE USER

    it(
      'should mark user inactive',
      () => {

        component.deleteUser(
          mockUser
        );

        expect(
          component.users()[0]
            .status
        ).toBe(
          'Inactive'
        );
      }
    );

    // TRACKBY

    it(
      'should track user by id',
      () => {

        const result =
          component.trackByUserId(
            0,
            mockUser
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

    // SEARCH EMAIL

    it(
      'should filter by email',
      (async() => {

        component.searchControl
          .setValue(
            'emma.watson'
          );

        await new Promise(resolve => setTimeout(resolve, 400));

        fixture.detectChanges();

        expect(
          component
            .filteredUsers()
            .length
        ).toBe(1);
      })
    );

    // FILTER NO USERS

    it(
      'should return empty list when no match',
      (async() => {

        component.searchControl
          .setValue('xyz');

        await new Promise(resolve => setTimeout(resolve, 400));

        fixture.detectChanges();

        expect(
          component
            .filteredUsers()
            .length
        ).toBe(0);
      })
    );
  }
);