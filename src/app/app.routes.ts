import { Routes } from '@angular/router';
import { authGuard } from './Core/Auth/Guards/auth.guard';
import { adminGuard } from './Core/Auth/Guards/admin.guard';
import { publicGuard } from './Core/Auth/Guards/public.guard';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { DashboardBodyComponent } from './components/dashboardBody/dashboardBody.component';
import { UserManagementComponent } from './components/UserManagement/UserList/UserManagement.component';
import { EditUserComponent } from './components/UserManagement/editUser/editUser.component';
import { dishesComponent } from './components/products/dishes.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrdersComponent } from './components/orders/orders.component';

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
        canActivate: [adminGuard],
        component: DashboardComponent,
        children: [
          {
            path: '',
            component: DashboardBodyComponent,
            title: 'Dashboard',
          },
          {
            path: 'Users',
            canActivate: [adminGuard],
            children: [
              {
                path: '',
                component: UserManagementComponent,
                title: 'User Management',
              },
              {
                path: 'Edit/:id',
                component: EditUserComponent,
                title: 'Edit User',
              },
            ],
          },
          {
            path: 'Dishes',
            canActivate: [adminGuard],
            component: dishesComponent,
          },
          {
            path: 'Categories',
            canActivate: [adminGuard],
            component: CategoriesComponent,
          },
          {
            path: 'Orders',
            component: OrdersComponent,
          },
        ],
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
    // component: UserComponent,
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
