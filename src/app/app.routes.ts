import { Routes } from '@angular/router';
import { UserComponent } from './modules/user/user/user.component';
import { RegistrationComponent } from './modules/user/registration/registration/registration.component';
import { LoginComponent } from './modules/user/login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

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
  },
];
