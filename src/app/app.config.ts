import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './Core/Auth/interceptors/auth.interceptor';
import { UnwrapResponseInterceptor } from './Core/Auth/interceptors/unwrap-response.interceptor';
import { ErrorHandlingInterceptor } from './Core/Auth/interceptors/error-handling.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        ErrorHandlingInterceptor,
        UnwrapResponseInterceptor,
      ]),
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    provideToastr({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
};
