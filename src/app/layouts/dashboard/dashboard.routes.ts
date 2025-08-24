import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { adminGuard } from '../../Core/Auth/Guards/admin.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../components/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
        title: 'Dashboard',
      },
      {
        path: 'Users',
        loadChildren: () =>
          import('../../user-management.routes').then(
            (m) => m.userManagementRoutes
          ),
      },
      {
        path: 'Dishes',
        loadComponent: () =>
          import('../../components/products/dishes.component').then(
            (m) => m.dishesComponent
          ),
      },
      {
        path: 'Categories',
        loadComponent: () =>
          import('../../components/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
      },
      {
        path: 'Orders',
        loadComponent: () =>
          import('../../components/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
      },
    ],
  },
];
