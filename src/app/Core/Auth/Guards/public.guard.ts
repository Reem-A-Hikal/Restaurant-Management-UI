import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasSession =
    authService.isAuthenticated() || !!authService.getRefreshToken();

  if (hasSession) {
    if (authService.isAdmin() || authService.isChef()) {
      router.navigate(['/Dashboard']);
    } else if (authService.isDeliveryPerson()) {
      router.navigate(['/Courier']);
    } else {
      router.navigate(['/main'], {
        queryParams: { error: 'unauthorized' },
      });
    }
    return false;
  }
  return true;
};
