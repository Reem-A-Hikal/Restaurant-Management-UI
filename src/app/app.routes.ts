import { Routes } from '@angular/router';
import { UserComponent } from './modules/user/user/user.component';
import { RegistrationComponent } from './modules/user/registration/registration/registration.component';
import { LoginComponent } from './modules/user/login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './Core/Auth/shared/auth.guard';
import { MainComponent } from './layout/main/main/main.component';
import { adminGuard } from './Core/Auth/shared/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'signup', component: RegistrationComponent },
      { path: 'signin', component: LoginComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, adminGuard],
    data: { Title: 'Dashboard' },
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard],
    data: { Title: 'Rest' },
  },
  { path: '*', redirectTo: 'main' },
];
