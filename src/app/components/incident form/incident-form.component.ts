import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatChipsModule,
  ],

  templateUrl:
    './incident-form.component.html',

  styleUrls: [
    './incident-form.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class IncidentFormComponent {

  submitted = signal(false);

  severityLevels = [
    'LOW',
    'MEDIUM',
    'HIGH',
  ];

  incidentTypes = [
    'Technical Failure',
    'Communication Failure',
    'Engine Issue',
    'Weather Impact',
    'Navigation Issue',
  ];

  teams = [
    'ATC Team',
    'Engineering Team',
    'Operations Team',
    'Emergency Response Team',
  ];

  fb = new FormBuilder();

  incidentForm = this.fb.group({

    flightId: [
      '',
      Validators.required,
    ],

    incidentType: [
      '',
      Validators.required,
    ],

    severity: [
      '',
      Validators.required,
    ],

    description: [
      '',
      [
        Validators.required,
        Validators.minLength(15),
      ],
    ],

    timestamp: [
      '',
      Validators.required,
    ],

    assignedTeam: [''],

    communicationFrequency: [''],

    lastCommunicationTime: [''],
  });

  // DYNAMIC CONDITIONS

  isHighSeverity = computed(() =>

    this.incidentForm
      .get('severity')
      ?.value === 'HIGH'
  );

  isCommunicationFailure =
    computed(() =>

      this.incidentForm
        .get('incidentType')
        ?.value ===
      'Communication Failure'
    );

  constructor() {

    this.handleDynamicValidation();
  }

  // DYNAMIC VALIDATIONS

  handleDynamicValidation(): void {

    // SEVERITY

    this.incidentForm
      .get('severity')
      ?.valueChanges.subscribe(
        (severity) => {

          const assignedTeam =
            this.incidentForm.get(
              'assignedTeam'
            );

          if (severity === 'HIGH') {

            assignedTeam?.setValidators(
              Validators.required
            );

          } else {

            assignedTeam?.clearValidators();
          }

          assignedTeam?.updateValueAndValidity();
        }
      );

    // COMMUNICATION FAILURE

    this.incidentForm
      .get('incidentType')
      ?.valueChanges.subscribe(
        (type) => {

          const frequency =
            this.incidentForm.get(
              'communicationFrequency'
            );

          const lastTime =
            this.incidentForm.get(
              'lastCommunicationTime'
            );

          if (
            type ===
            'Communication Failure'
          ) {

            frequency?.setValidators(
              Validators.required
            );

            lastTime?.setValidators(
              Validators.required
            );

          } else {

            frequency?.clearValidators();

            lastTime?.clearValidators();
          }

          frequency?.updateValueAndValidity();

          lastTime?.updateValueAndValidity();
        }
      );
  }

  // SUBMIT

  submitIncident(): void {

    this.submitted.set(true);

    if (
      this.incidentForm.invalid
    ) {

      this.incidentForm.markAllAsTouched();

      return;
    }

    console.log(
      'Incident Submitted',
      this.incidentForm.value
    );

    this.incidentForm.reset();

    this.submitted.set(false);
  }

  // RESET

  resetForm(): void {

    this.incidentForm.reset();

    this.submitted.set(false);
  }

  // VALIDATION

  hasError(
    controlName: string
  ): boolean {

    const control =
      this.incidentForm.get(
        controlName
      );

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }
}