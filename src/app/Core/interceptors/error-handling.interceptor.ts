import { AuthService } from './../Auth/services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, EMPTY } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { extractErrorResponse } from '../../shared/helpers/error.helper';

// let isHandlingUnauthorized = false;
let isRefreshing = false;
const refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

function forceLogout(
  router: Router,
  authService: AuthService,
  toastr: ToastrService,
): void {
  authService.logout();
  router.navigate(['/signin'], { queryParams: { returnUrl: router.url } });
  toastr.error(
    'Your session has expired, please sign in again',
    'Session Expired',
  );
}

function attachToken(
  req: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  router: Router,
  authService: AuthService,
  toastr: ToastrService,
): Observable<HttpEvent<unknown>> {
  console.log(
    'handleUnauthorized called. Refresh token:',
    authService.getRefreshToken(),
  );
  if (!authService.getRefreshToken()) {
    forceLogout(router, authService, toastr);
    return EMPTY;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject$.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject$.next(response.token);
        return next(attachToken(req, response.token));
      }),
      catchError((err) => {
        isRefreshing = false;
        forceLogout(router, authService, toastr);
        return EMPTY;
      }),
    );
  }

  return refreshTokenSubject$.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((token) => next(attachToken(req, token))),
  );
}

function isAuthEndpoint(url: string): boolean {
  const authPaths = [
    '/account/login',
    '/account/refresh-token',
    '/account/register',
    '/account/logout',
  ];
  return authPaths.some((path) => url.includes(path));
}

function isRefreshTokenEndpoint(url: string): boolean {
  return url.includes('/account/refresh-token');
}

function handleHttpError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  error: HttpErrorResponse,
  router: Router,
  toastr: ToastrService,
  authService: AuthService,
): Observable<HttpEvent<unknown>> {
  const serverErrorCodes = [500, 502, 503];
  const componentHandledCodes = [400, 404];

  if (error.status === 401) {
    if (isAuthEndpoint(req.url)) {
      if (isRefreshTokenEndpoint(req.url)) {
        forceLogout(router, authService, toastr);
      }
      // If we forced logout due to refresh failure, complete the stream to avoid duplicate error handling in components
      if (isRefreshTokenEndpoint(req.url)) return EMPTY;
      return throwError(() => error);
    }

    return handleUnauthorized(req, next, router, authService, toastr);
  }

  if (isAuthEndpoint(req.url)) {
    return throwError(() => error);
  }

  if (componentHandledCodes.includes(error.status)) {
    return throwError(() => error);
  }

  if (error.status === 403) {
    toastr.error(
      'You do not have permission to perform this action',
      'Access Denied',
    );
    router.navigate(['/access-denied']);
  } else if (error.status === 0) {
    toastr.error(
      'Unable to connect to the server. Please check your internet connection.',
      'Network Error',
    );
  } else if (serverErrorCodes.includes(error.status)) {
    toastr.error(
      extractErrorResponse(error) ||
        'An unexpected server error occurred. Please try again later.',
      'Server Error',
    );
  } else {
    toastr.error(
      extractErrorResponse(error) ||
        'An unexpected error occurred. Please try again later.',
      'Error',
    );
  }
  return throwError(() => error);
}

export function ErrorHandlingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) =>
      handleHttpError(req, next, error, router, toastr, authService),
    ),
  );
}
