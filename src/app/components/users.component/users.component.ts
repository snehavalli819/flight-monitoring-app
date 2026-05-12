import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';

import { toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user.dialog';

export interface User {
  id: number;

  name: string;

  email: string;

  role:
    | 'Supervisor'
    | 'Controller'
    | 'Viewer';

  status:
    | 'Active'
    | 'Inactive';

  lastLogin: string;
}

@Component({
  selector: 'app-users',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
  ],

  templateUrl:
    './users.component.html',

  styleUrls: [
    './users.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {

  displayedColumns = [
    'user',
    'role',
    'status',
    'lastLogin',
    'actions',
  ];

  searchControl =
    new FormControl('', {
      nonNullable: true,
    });

  selectedRole =
    signal('ALL');

  private dialog = inject(MatDialog);

  users = signal<User[]>([
    {
      id: 1,

      name: 'John Carter',

      email:
        'john.carter@airnav.com',

      role: 'Supervisor',

      status: 'Active',

      lastLogin:
        '11 May 2026, 10:22 AM',
    },

    {
      id: 2,

      name: 'Emma Watson',

      email:
        'emma.watson@airnav.com',

      role: 'Controller',

      status: 'Active',

      lastLogin:
        '11 May 2026, 09:48 AM',
    },

    {
      id: 3,

      name: 'Alex Brown',

      email:
        'alex.brown@airnav.com',

      role: 'Viewer',

      status: 'Inactive',

      lastLogin:
        '10 May 2026, 06:10 PM',
    },
  ]);

  searchTerm = toSignal(

    this.searchControl.valueChanges.pipe(

      startWith(''),

      debounceTime(400),

      distinctUntilChanged()
    ),

    { initialValue: '' }
  );

  filteredUsers = computed(() => {

    const search =
      this.searchTerm()
        .toLowerCase()
        .trim();

    return this.users().filter(
      (user) => {

        const matchesSearch =

          user.name
            .toLowerCase()
            .includes(search) ||

          user.email
            .toLowerCase()
            .includes(search);

        const matchesRole =

          this.selectedRole() ===
            'ALL' ||

          user.role ===
            this.selectedRole();

        return (
          matchesSearch &&
          matchesRole
        );
      }
    );
  });

  // ROLE FILTER

  updateRole(
    role: string
  ): void {

    this.selectedRole.set(role);
  }

  // ROLE CLASS

  getRoleClass(
    role: string
  ): string {

    switch (role) {

      case 'Supervisor':
        return 'role-supervisor';

      case 'Controller':
        return 'role-controller';

      case 'Viewer':
        return 'role-viewer';

      default:
        return '';
    }
  }

  // STATUS CLASS

  getStatusClass(
    status: string
  ): string {

    return status === 'Active'
      ? 'status-active'
      : 'status-inactive';
  }

  // ACTIONS

  editUser(
    user: User
  ): void {

    // permission check moved to template in many places; double-check here
    // open dialog
    try {
      const ref = this.dialog.open(EditUserDialogComponent, {
        data: user,
        width: '420px',
      });

      ref.afterClosed().subscribe((result) => {
        if (result) {
          // update users list
          this.users.update((list) =>
            list.map((u) => (u.id === result.id ? { ...u, ...result } : u))
          );
        }
      });
    } catch (e) {
      console.warn('Failed to open edit dialog', e);
    }
  }

  deleteUser(
    user: User
  ): void {

    this.users.update((list) =>
            list.map((u) => (u.id === user.id ? { ...u, status: 'Inactive' } : u))
          );
  }

  trackByUserId = (
    _: number,
    item: User
  ) => item.id;
}