import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService }
from '../services/auth.service';

export const authGuard:
CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  // AUTH CHECK

  if (
    authService.isAuthenticated()
  ) {

    return true;
  }

  // REDIRECT

  router.navigate([
    '/signin',
  ]);

  return false;
};