import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatSidenavModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  sidebarOpened = signal(false);

  alertCount = signal(12);

  // derive role from AuthService when available
  private authService = inject(AuthService);

  currentRole = this.authService.userRole;

  isAuthenticated = this.authService.isAuthenticated;

  currentUser = this.authService.currentUser;

  // template reference for matMenu trigger
  

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
    route: '/',
    },
    {
      label: 'Flights',
      icon: 'flight',
      route: '/flights',
    },
    {
      label: 'Live Tracking',
      icon: 'travel_explore',
  route: '/map',
    },
    {
      label: 'Alerts',
      icon: 'notifications_active',
      route: '/alerts',
    },
    {
      label: 'Incidents',
      icon: 'report_problem',
  route: '/incidents',
    },
    {
      label: 'Users & Roles',
      icon: 'groups',
      route: '/users',
    },
  ];

  toggleSidebar(): void {
    this.sidebarOpened.update((value) => !value);
  }

  trackByLabel = (_: number, item: NavItem) =>
    item.label;

  logout(): void {
    this.authService.logout();
  }
}