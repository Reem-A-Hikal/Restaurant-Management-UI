import { Routes } from '@angular/router';
import { UserComponent } from './modules/user/user/user.component';
import { RegistrationComponent } from './modules/user/registration/registration/registration.component';
import { LoginComponent } from './modules/user/login/login/login.component';
import { authGuard } from './Core/Auth/shared/auth.guard';
import { MainComponent } from './layouts/main/main.component';
import { adminGuard } from './Core/Auth/shared/admin.guard';
import { publicGuard } from './Core/Auth/shared/public.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardBodyComponent } from './components/dashboardBody/dashboardBody.component';

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
        children: [{ path: '', component: DashboardBodyComponent }],
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
];
