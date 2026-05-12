import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatCardModule }
from '@angular/material/card';

import { MatIconModule }
from '@angular/material/icon';

import { MatButtonModule }
from '@angular/material/button';

export interface FlightDetailsData {

  id: string;

  aircraftType: string;

  departureAirport: string;

  destinationAirport: string;

  firRegion: string;

  altitude: number;

  speed: number;

  status: string;

  eta: string;

  lastUpdated: string;
}

@Component({
  selector:
    'app-flight-details',

  standalone: true,

  imports: [
    CommonModule,

    MatDialogModule,

    MatCardModule,

    MatIconModule,

    MatButtonModule,
  ],

  templateUrl:
    './flight-detail.component.html',

  styleUrls: [
    './flight-detail.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class FlightDetailComponent {

  constructor(

    @Inject(MAT_DIALOG_DATA)

    public data:
      FlightDetailsData,

    private dialogRef:
      MatDialogRef<FlightDetailComponent>
  ) {}

  close(): void {

    this.dialogRef.close();
  }
}