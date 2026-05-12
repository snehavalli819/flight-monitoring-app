import {
  Injectable,
  computed,
  signal,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

export interface AppUser {
  id: number;

  name: string;

  email: string;

  password: string;

  role:
    | 'Supervisor'
    | 'Controller'
    | 'Viewer';

  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  currentUser =
    signal<AppUser | null>(null);

  users =
    signal<AppUser[]>([]);

  isAuthenticated = computed(() =>

    !!this.currentUser()
  );

  userRole = computed(() =>

    this.currentUser()?.role
  );

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.loadUsers();
  }

  // LOAD USERS

  loadUsers(): void {

    this.http
      .get<AppUser[]>(
        'assets/users.json'
      )
      .subscribe({

        next: (users) => {

          this.users.set(users);
        },

        error: (error) => {

          console.error(
            'Failed to load users',
            error
          );
        },
      });
  }

  // LOGIN

  login(
    email: string,
    password: string
  ): boolean {

    const user =
      this.users().find(

        (user) =>

          user.email === email &&

          user.password ===
            password &&

          user.status === 'Active'
      );

    if (user) {

      this.currentUser.set(user);

      // Persist session in history.state so it travels with navigation (browser only)
      try {
        if (
          typeof window !== 'undefined' &&
          window.history &&
          typeof window.history.replaceState === 'function'
        ) {
          const prev = window.history.state || {};
          const next = { ...prev, 'flight-user': user };
          window.history.replaceState(next, document.title);
        }
      } catch {
        // ignore
      }

      return true;
    }

    return false;
  }

  // LOGOUT

  logout(): void {

    this.currentUser.set(null);
    // Remove from history.state when possible
    try {
      if (
        typeof window !== 'undefined' &&
        window.history &&
        typeof window.history.replaceState === 'function'
      ) {
        const prev = window.history.state || {};
        const { ['flight-user']: _removed, ...rest } = prev as any;
        window.history.replaceState(rest, document.title);
      }
    } catch {
      // ignore
    }

    // Perform a full page reload to ensure all UI state is cleared.
    // Use window when available (browser); fall back to router navigation for SSR.
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = '/signin';
    } else {
      this.router.navigate(['/signin']);
    }
  }

  // RESTORE SESSION

  restoreSession(): void {

    try {
      if (
        typeof window !== 'undefined' &&
        window.history &&
        window.history.state
      ) {
        const storedUser = window.history.state['flight-user'];

        if (storedUser) {
          this.currentUser.set(storedUser as AppUser);
          return;
        }
      }
    } catch {
      // ignore
    }
  }

  // ACCESS CHECKS

  isSupervisor(): boolean {

    return (
      this.currentUser()?.role ===
      'Supervisor'
    );
  }

  isController(): boolean {

    return (
      this.currentUser()?.role ===
      'Controller'
    );
  }

  isViewer(): boolean {

    return (
      this.currentUser()?.role ===
      'Viewer'
    );
  }

  canEdit(): boolean {

    return [
      'Supervisor',
      'Controller',
    ].includes(
      this.currentUser()?.role || ''
    );
  }

  canView(): boolean {

    return !!this.currentUser();
  }

  hasFullAccess(): boolean {

    return (
      this.currentUser()?.role ===
      'Supervisor'
    );
  }
}