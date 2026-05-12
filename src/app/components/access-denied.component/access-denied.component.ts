import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { RouterModule }
from '@angular/router';

import { MatButtonModule }
from '@angular/material/button';

@Component({
  selector:
    'app-access-denied',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],

  templateUrl:
    './access-denied.component.html',

  styleUrls: [
    './access-denied.component.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}