import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorResponse(
  err: HttpErrorResponse,
  fallback: string = 'Something went wrong. Please try again.',
): string {
  return err.error?.message || err.error?.errors?.[0] || fallback;
}
