import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss'],
})
export class IncidentFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      flightId: ['', Validators.required],
      type: ['other', Validators.required],
      severity: ['low', Validators.required],
      description: [''],
      assignedTeam: [''],
    });

    this.form.get('severity')?.valueChanges.subscribe((val) => this.updateValidators(String(val || '')));
    this.form.get('type')?.valueChanges.subscribe(() => this.updateValidators(String(this.form.get('severity')?.value || '')));
  }

  get showAssigned() {
    return String(this.form.get('severity')?.value || '') === 'high';
  }

  private updateValidators(severity: string) {
    if (severity === 'high') {
      this.form.get('assignedTeam')?.setValidators([Validators.required]);
    } else {
      this.form.get('assignedTeam')?.clearValidators();
    }
    this.form.get('assignedTeam')?.updateValueAndValidity();
  }

  submit() {
    if (this.form.valid) {
      // TODO: wire to incident service
      console.log('Incident', this.form.value);
      this.form.reset({ type: 'other', severity: 'low' });
    }
  }
}
