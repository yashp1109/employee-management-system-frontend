import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Role } from '../models/models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.accessToken) {
    return router.createUrlTree(['/login']);
  }
  return true;
};

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as Role[];
  if (!auth.accessToken) {
    return router.createUrlTree(['/login']);
  }
  if (roles?.length && !auth.hasRole(roles)) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
