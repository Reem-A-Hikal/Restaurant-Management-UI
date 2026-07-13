import { Routes } from '@angular/router';
import { adminGuard } from '../../Core/Auth/Guards/admin.guard';
import { DashboardComponent } from '../../layouts/dashboard/dashboard.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./overview/overview.component').then(
            (m) => m.OverviewComponent,
          ),
        title: 'Dashboard',
      },
      {
        path: 'Staff',
        loadChildren: () =>
          import('../users/users.routes').then((m) => m.usersRoutes),
        title: 'Staff',
      },
      {
        path: 'Dishes',
        loadComponent: () =>
          import('../dishes/pages/dishes-list/dishes.component').then(
            (m) => m.DishesComponent,
          ),
        title: 'Dishes',
      },
      {
        path: 'Categories',
        loadChildren: () =>
          import('../categories/categories.routes').then(
            (m) => m.categoriesRoutes,
          ),
        title: 'Categories',
      },
      {
        path: 'Orders',
        loadChildren: () =>
          import('../orders/orders.routes').then((m) => m.ordersRoutes),
        title: 'Orders',
      },
      {
        path: 'Profile',
        loadComponent: () =>
          import('../profile/pages/my-profile/my-profile.component').then(
            (m) => m.MyProfileComponent,
          ),
        title: 'My Profile',
      },
    ],
  },
];
