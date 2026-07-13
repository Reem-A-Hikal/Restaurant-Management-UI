import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { extractErrorResponse } from '../../../shared/helpers/error.helpers';

let isHandlingUnauthorized = false;

function handleUnauthorized(
  router: Router,
  authService: AuthService,
  toastr: ToastrService,
): void {
  if (!isHandlingUnauthorized) {
    isHandlingUnauthorized = true;
    authService.logout();
    router
      .navigate(['/signin'], { queryParams: { returnUrl: router.url } })
      .finally(() => {
        isHandlingUnauthorized = false;
      });
    toastr.error(
      'Your session has expired, please sign in again',
      'Session Expired',
    );
  }
}

function handleHttpError(
  error: HttpErrorResponse,
  router: Router,
  toastr: ToastrService,
  authService: AuthService,
): void {
  const serverErrorCodes = [500, 502, 503];
  const serverErrorHandler = () =>
    toastr.error(extractErrorResponse(error), 'Server Error');

  const errorHandlers: Record<number, () => void> = {
    401: () => handleUnauthorized(router, authService, toastr),
    403: () =>
      toastr.error(
        'You do not have permission to access this resource.',
        'Access Denied',
      ),
    0: () =>
      toastr.error(
        'Unable to connect to the server. Please check your internet connection.',
        'Network Error',
      ),
  };

  if (serverErrorCodes.includes(error.status)) {
    serverErrorHandler();
  } else {
    errorHandlers[error.status]?.() ??
      toastr.error(extractErrorResponse(error), 'Error');
  }
}

export function ErrorHandlingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleHttpError(error, router, toastr, authService);
      return throwError(() => error);
    }),
  );
}
