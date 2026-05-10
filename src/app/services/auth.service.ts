import { Injectable, signal } from '@angular/core';

export type Role = 'supervisor' | 'controller' | 'viewer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private roleSignal = signal<Role>('viewer');
  role$ = this.roleSignal;

  setRole(r: Role) {
    this.roleSignal.set(r);
  }

  getRole(): Role {
    return this.roleSignal();
  }

  isAtLeastController() {
    const r = this.roleSignal();
    return r === 'controller' || r === 'supervisor';
  }
}
