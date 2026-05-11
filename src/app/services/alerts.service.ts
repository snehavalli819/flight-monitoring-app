import {
  Injectable,
  signal,
  inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertToastComponent } from '../components/alert-toast.component/alert-toast.component';

export type AlertSeverity =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW';

export interface FlightAlert {
  id: number;

  flightId: string;

  type:
    | 'ALTITUDE_DROP'
    | 'SPEED_EXCEEDED'
    | 'DELAY';

  message: string;

  severity: AlertSeverity;

  timestamp: Date;

  isRead: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  alerts = signal<FlightAlert[]>([]);

  alertCount = signal(0);

  // MatSnackBar (used to open the alert toast)
  private snackBar = inject(MatSnackBar);

  // CREATE ALERT

  generateAlert(
    alert: Omit<
      FlightAlert,
      'id' | 'timestamp' | 'isRead'
    >
  ): void {

    const newAlert: FlightAlert = {

      ...alert,

      id: Date.now(),

      timestamp: new Date(),

      isRead: false,
    };

    this.alerts.update((alerts) => [
      newAlert,
      ...alerts,
    ]);

    this.alertCount.update(
      (count) => count + 1
    );

    // show a toast notification for the new alert
    this.showToast({
      flightId: newAlert.flightId,
      message: newAlert.message,
      severity: newAlert.severity,
    });
  }

  /**
   * Show an alert toast using Angular Material SnackBar and the
   * AlertToastComponent. Can be called from other services or
   * components as needed.
   */
  showToast(data: { flightId: string; message: string; severity: AlertSeverity }): void {
    try {
      this.snackBar.openFromComponent(AlertToastComponent, {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data,
      });
    } catch (e) {
      // graceful no-op if MatSnackBar isn't available in a test environment
      // or if module isn't imported; avoid throwing from the service
      // eslint-disable-next-line no-console
      console.warn('Unable to open alert toast', e);
    }
  }

  // MARK AS READ

  markAsRead(id: number): void {

    this.alerts.update((alerts) =>

      alerts.map((alert) =>

        alert.id === id
          ? {
              ...alert,
              isRead: true,
            }
          : alert
      )
    );
  }

  // CLEAR ALERT

  clearAlert(id: number): void {

    this.alerts.update((alerts) =>

      alerts.filter(
        (alert) => alert.id !== id
      )
    );

    this.alertCount.update((count) =>
      Math.max(count - 1, 0)
    );
  }

  // CLEAR ALL

  clearAll(): void {

    this.alerts.set([]);

    this.alertCount.set(0);
  }
}