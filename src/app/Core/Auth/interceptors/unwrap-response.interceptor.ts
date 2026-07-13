import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { map, Observable } from 'rxjs';

function isApiResponseShape(body: unknown): body is ApiResponse<unknown> {
  return (
    !!body && typeof body === 'object' && 'success' in body && 'data' in body
  );
}

export function UnwrapResponseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && isApiResponseShape(event.body)) {
        return event.clone({ body: event.body.data });
      }
      return event;
    }),
  );
}
