import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface AlertToastData {
  flightId: string;

  message: string;

  severity:
    | 'HIGH'
    | 'MEDIUM'
    | 'LOW';
}

@Component({
  selector: 'app-alert-toast',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl:
    './alert-toast.component.html',

  styleUrls: [
    './alert-toast.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AlertToastComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: AlertToastData,

    private snackBarRef:
      MatSnackBarRef<AlertToastComponent>
  ) {}

  close(): void {

    this.snackBarRef.dismiss();
  }

  getToastClass(): string {

    switch (this.data.severity) {

      case 'HIGH':
        return 'toast-high';

      case 'MEDIUM':
        return 'toast-medium';

      case 'LOW':
        return 'toast-low';

      default:
        return 'toast-low';
    }
  }

  getIcon(): string {

    switch (this.data.severity) {

      case 'HIGH':
        return 'warning';

      case 'MEDIUM':
        return 'speed';

      case 'LOW':
        return 'info';

      default:
        return 'notifications';
    }
  }
}