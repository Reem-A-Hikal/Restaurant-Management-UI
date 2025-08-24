import { Routes } from '@angular/router';
import { adminGuard } from './Core/Auth/Guards/admin.guard';

export const userManagementRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import(
        './components/UserManagement/UserList/UserManagement.component'
      ).then((m) => m.UserManagementComponent),
    title: 'User Management',
  },
  {
    path: 'Edit/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/UserManagement/editUser/editUser.component').then(
        (m) => m.EditUserComponent
      ),
    title: 'Edit User',
  },
];
