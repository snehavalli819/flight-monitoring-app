import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit User</h2>

    <form [formGroup]="form" (ngSubmit)="save()" style="padding:16px; display:flex; flex-direction:column; gap:12px;">
      <input matInput placeholder="Name" formControlName="name" />
      <input matInput placeholder="Email" formControlName="email" />

      <mat-select formControlName="role">
        <mat-option value="Supervisor">Supervisor</mat-option>
        <mat-option value="Controller">Controller</mat-option>
        <mat-option value="Viewer">Viewer</mat-option>
      </mat-select>

      <mat-select formControlName="status">
        <mat-option value="Active">Active</mat-option>
        <mat-option value="Inactive">Inactive</mat-option>
      </mat-select>

      <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </div>
    </form>
  `,
})
export class EditUserDialogComponent {
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [this.data?.id],
      name: [this.data?.name, [Validators.required]],
      email: [this.data?.email, [Validators.required, Validators.email]],
      role: [this.data?.role, [Validators.required]],
      status: [this.data?.status, [Validators.required]],
      lastLogin: [this.data?.lastLogin],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  close() {
    this.dialogRef.close();
  }
}
