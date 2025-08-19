import { Routes } from '@angular/router';
import { authGuard } from './Core/Auth/Guards/auth.guard';
import { MainComponent } from './layouts/main/main.component';
import { adminGuard } from './Core/Auth/Guards/admin.guard';
import { publicGuard } from './Core/Auth/Guards/public.guard';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { DashboardBodyComponent } from './components/dashboardBody/dashboardBody.component';
import { NotFoundComponent } from './components/shared/NotFound/NotFound.component';
import { UserManagementComponent } from './components/UserManagement/UserList/UserManagement.component';
import { EditUserComponent } from './components/UserManagement/editUser/editUser.component';
import { UserDetailsComponent } from './components/UserManagement/UserDetails/UserDetails.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrdersComponent } from './components/orders/orders.component';
import { UserComponent } from './components/user/user/user.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { LoginComponent } from './components/user/login/login.component';
import { dishesComponent } from './components/products/dishes.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'Home',
        pathMatch: 'full',
      },
      {
        path: 'Home',
        canActivate: [adminGuard],
        component: DashboardComponent,
        children: [
          { path: '', component: DashboardBodyComponent, title: 'Dashboard' },
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
              {
                path: 'View/:id',
                component: UserDetailsComponent,
                title: 'View User',
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
        component: MainComponent,
      },
    ],
  },
  {
    path: '',
    component: UserComponent,
    canActivate: [publicGuard],
    children: [
      { path: 'signup', component: RegistrationComponent },
      { path: 'signin', component: LoginComponent },
    ],
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];
