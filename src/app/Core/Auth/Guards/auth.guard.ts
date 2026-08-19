import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const hasSession =
    authService.isAuthenticated() || !!authService.getRefreshToken();

  if (!hasSession) {
    authService.logout();
    const toastr = inject(ToastrService);
    toastr.error(
      'Your session has expired, please sign in again',
      'Session Expired',
    );
    router.navigate(['/signin'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
