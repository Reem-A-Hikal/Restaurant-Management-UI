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
        title: 'User Management',
      },
      {
        path: 'Dishes',
        loadComponent: () =>
          import('../../components/dishes/ProductsList/dishes.component').then(
            (m) => m.DishesComponent
          ),
        title: 'Dishes',
      },
      {
        path: 'Categories',
        loadComponent: () =>
          import(
            '../../components/categories/categoriesList/categoriesList.component'
          ).then((m) => m.CategoriesListComponent),
        title: 'Categories',
      },
      {
        path: 'Orders',
        loadComponent: () =>
          import('../../components/orders/orders.component').then(
            (m) => m.OrdersComponent
          ),
        title: 'Orders',
      },
    ],
  },
];
