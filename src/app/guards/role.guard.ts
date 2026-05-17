import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService }
from '../services/auth.service';

export const roleGuard:
CanActivateFn = (

  route,

) => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  // REQUIRED ROLES

  const allowedRoles =
    route.data?.['roles'] || [];

  // CURRENT USER

  const currentRole =
    authService.userRole();

  // ACCESS CHECK

  const hasAccess =
    allowedRoles.includes(
      currentRole
    );

  if (hasAccess) {

    return true;
  }

  // REDIRECT

  router.navigate([
    '/access-denied',
  ]);

  return false;
};