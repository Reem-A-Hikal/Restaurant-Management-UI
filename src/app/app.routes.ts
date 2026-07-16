import { Routes } from '@angular/router';
import { authGuard } from './Core/Auth/Guards/auth.guard';
import { publicGuard } from './Core/Auth/Guards/public.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
      {
        path: 'Dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes,
          ),
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./layouts/main/main.component').then((m) => m.MainComponent),
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./shared/components/access-denied/access-denied.component').then(
            (m) => m.AccessDeniedComponent,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/authView/auth.component').then(
        (m) => m.AuthComponent,
      ),
    canActivate: [publicGuard],
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/registration/registration.component').then(
            (m) => m.RegistrationComponent,
          ),
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/NotFound/NotFound.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
