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
          import('./layouts/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'main',
        loadComponent: () =>
          import('./layouts/main/main.component').then((m) => m.MainComponent),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/user/user/user.component').then(
        (m) => m.UserComponent
      ),
    canActivate: [publicGuard],
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/user/registration/registration.component').then(
            (m) => m.RegistrationComponent
          ),
      },
      {
        path: 'signin',
        loadComponent: () =>
          import('./components/user/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./components/shared/NotFound/NotFound.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
