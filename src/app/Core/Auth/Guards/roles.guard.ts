import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    authService.logout();
    router.navigate(['/signin'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) return true;

  if (!allowedRoles.includes(authService.getRole())) {
    router.navigateByUrl('/access-denied');
    return false;
  }
  return true;
};
