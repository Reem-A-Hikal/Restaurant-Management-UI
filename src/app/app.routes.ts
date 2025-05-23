import { Routes } from '@angular/router';
import { UserComponent } from './models/user/user/user.component';
import { RegistrationComponent } from './models/user/registration/registration/registration.component';
import { LoginComponent } from './models/user/login/login/login.component';
import { authGuard } from './Core/Auth/shared/auth.guard';
import { MainComponent } from './layouts/main/main.component';
import { adminGuard } from './Core/Auth/shared/admin.guard';
import { publicGuard } from './Core/Auth/shared/public.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardBodyComponent } from './components/dashboardBody/dashboardBody.component';
import { NotFoundComponent } from './layouts/NotFound/NotFound.component';
import { UserManagementComponent } from './components/UserManagement/UserList/UserManagement.component';
import { EditUserComponent } from './components/UserManagement/editUser/editUser.component';
import { UserDetailsComponent } from './components/UserManagement/UserDetails/UserDetails.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { OrdersComponent } from './components/orders/orders.component';

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
            path: 'Products',
            canActivate: [adminGuard],
            component: ProductsComponent,
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
