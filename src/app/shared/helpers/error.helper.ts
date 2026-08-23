import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorResponse(
  err: HttpErrorResponse,
  fallback: string = 'Something went wrong. Please try again.',
): string {
  return err.error?.message || err.error?.errors?.[0] || fallback;
}


const INTERCEPTOR_HANDLED_STATUSES = new Set([403, 0, 500, 502, 503]);

export function shouldComponentShowError(err: HttpErrorResponse): boolean {
  return !INTERCEPTOR_HANDLED_STATUSES.has(err.status);
}
