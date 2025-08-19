import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function AuthInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  return next(req);
}
