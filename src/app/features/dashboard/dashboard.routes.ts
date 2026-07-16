import { Routes } from '@angular/router';
import { DashboardComponent } from '../../layouts/dashboard/dashboard.component';
import { rolesGuard } from '../../Core/Auth/Guards/roles.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [rolesGuard],
    data: { roles: ['Admin', 'Chef'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./overview/overview-router.component').then(
            (m) => m.OverviewRouterComponent,
          ),
        title: 'Dashboard',
        canActivate: [rolesGuard],
        data: { roles: ['Admin', 'Chef'] },
      },
      {
        path: 'Staff',
        loadChildren: () =>
          import('../users/users.routes').then((m) => m.usersRoutes),
        title: 'Staff',
        canActivate: [rolesGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'Dishes',
        loadComponent: () =>
          import('../dishes/pages/dishes/dishes.component').then(
            (m) => m.DishesComponent,
          ),
        title: 'Dishes',
        canActivate: [rolesGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'Categories',
        loadChildren: () =>
          import('../categories/categories.routes').then(
            (m) => m.categoriesRoutes,
          ),
        title: 'Categories',
        canActivate: [rolesGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'Orders',
        loadChildren: () =>
          import('../orders/orders.routes').then((m) => m.ordersRoutes),
        title: 'Orders',
        canActivate: [rolesGuard],
        data: { roles: ['Admin', 'Chef'] },
      },
      {
        path: 'Profile',
        loadComponent: () =>
          import('../profile/pages/my-profile/my-profile.component').then(
            (m) => m.MyProfileComponent,
          ),
        title: 'My Profile',
        canActivate: [rolesGuard],
        data: { roles: ['Admin', 'Chef'] },
      },
    ],
  },
];
