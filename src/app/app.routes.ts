import { Routes } from '@angular/router';
import { UserComponent } from './modules/user/user/user.component';
import { RegistrationComponent } from './modules/user/registration/registration/registration.component';
import { LoginComponent } from './modules/user/login/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'signup', component: RegistrationComponent },
      { path: 'signin', component: LoginComponent },
    ],
  },
];
