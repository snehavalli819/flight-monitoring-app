import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { IncidentService } from '../../services/incident.service';
import { Router } from '@angular/router';



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
export class IncidentFormComponent implements OnInit, OnDestroy {

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

  private subs: Subscription[] = [];

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
      [Validators.required, this.pastDateValidatorFn],
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
private incidentService =
  inject(IncidentService);
private router = inject(Router);
  constructor() {}

  ngOnInit(): void {
    this.handleDynamicValidation();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  // DYNAMIC VALIDATIONS

  handleDynamicValidation(): void {

    // SEVERITY

    const severityCtrl = this.incidentForm.get('severity');

    if (severityCtrl?.valueChanges) {
      const s = severityCtrl.valueChanges.subscribe(
        (severity) => {
          const assignedTeam = this.incidentForm.get('assignedTeam');

          if (severity === 'HIGH') {
            assignedTeam?.setValidators(Validators.required);
          } else {
            assignedTeam?.clearValidators();
          }

          assignedTeam?.updateValueAndValidity();
        }
      );

      this.subs.push(s);
    }

    // COMMUNICATION FAILURE

    const incidentTypeCtrl = this.incidentForm.get('incidentType');

    if (incidentTypeCtrl?.valueChanges) {
      const s2 = incidentTypeCtrl.valueChanges.subscribe((type) => {
        const frequency = this.incidentForm.get('communicationFrequency');

        const lastTime = this.incidentForm.get('lastCommunicationTime');

        if (type === 'Communication Failure') {
          frequency?.setValidators(Validators.required);
          lastTime?.setValidators(Validators.required);
        } else {
          frequency?.clearValidators();
          lastTime?.clearValidators();
        }

        frequency?.updateValueAndValidity();
        lastTime?.updateValueAndValidity();
      });

      this.subs.push(s2);
    }
  }

  // SUBMIT
// validator: ensures date is strictly before today
pastDateValidatorFn(control: any) {
  const value = control?.value;

  if (!value) return null;

  const selected = new Date(value);
  const today = new Date();

  selected.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  return selected <= today ? null : { notPastDate: true };
}

 submitIncident(): void {

  this.submitted.set(true);

  if (
    this.incidentForm.invalid
  ) {

    this.incidentForm.markAllAsTouched();

    return;
  }

  const vals = this.incidentForm.getRawValue();

  // ensure timestamp is serialized if Date object
  const rawTimestamp = vals.timestamp;
  const timestampStr =
    rawTimestamp && typeof rawTimestamp === 'object' && 'toISOString' in rawTimestamp
      ? (rawTimestamp as any).toISOString()
      : (rawTimestamp as string) || new Date().toISOString();

  this.incidentService.addIncident({
    flightId: (vals.flightId as string) || '',
    incidentType: (vals.incidentType as string) || '',
    severity: (vals.severity as 'LOW' | 'MEDIUM' | 'HIGH') || 'LOW',
    description: (vals.description as string) || '',
    timestamp: timestampStr,
    assignedTeam: (vals.assignedTeam as string) || undefined,
    communicationFrequency: (vals.communicationFrequency as string) || undefined,
    lastCommunicationTime: (vals.lastCommunicationTime as string) || undefined,
    reportedBy: 'Controller',
  });

  // reset form and redirect to history so the new incident is visible
  this.incidentForm.reset();
  this.submitted.set(false);

  // navigate back to incident history
  try {
    this.router.navigate(['/incidents']);
  } catch (e) {
    // fallback: full reload
    if (typeof window !== 'undefined') {
      window.location.href = '/incidents';
    }
  }
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

  // Custom validator: date must be strictly before today
  pastDateValidator = (control: any) => {
    const value = control?.value;

    if (!value) return null;

    const selected = new Date(value);
    const today = new Date();

    // zero out time portion for comparison
    selected.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    return selected < today ? null : { notPastDate: true };
  };
}