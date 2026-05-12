import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';


import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],

  templateUrl:
    './sign-in.component.html',

  styleUrls: [
    './sign-in.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class SigninComponent {

  private authService =
    inject(AuthService);

  private router =
    inject(Router);

  hidePassword =
    signal(true);

  loginError =
    signal('');

  fb = new FormBuilder();

  signinForm = this.fb.group({

    email: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    password: [
      '',
      Validators.required,
    ],
  });

  // LOGIN

  login(): void {

    this.loginError.set('');

    if (
      this.signinForm.invalid
    ) {

      this.signinForm.markAllAsTouched();

      return;
    }

    const {
      email,
      password,
    } = this.signinForm.getRawValue();

    const success =
      this.authService.login(
        email || '',
        password || ''
      );

    if (success) {

      this.router.navigate([
        '/dashboard',
      ]);

    } else {

      this.loginError.set(
        'Invalid credentials'
      );
    }
  }

  // PASSWORD TOGGLE

  togglePassword(): void {

    this.hidePassword.update(
      (value) => !value
    );
  }
}