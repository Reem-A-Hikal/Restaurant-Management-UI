import { Routes } from '@angular/router';
import { adminGuard } from '../../Core/Auth/Guards/admin.guard';

export const usersRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then(
        (m) => m.UserListComponent,
      ),
    title: 'Staff',
  },
  {
    path: 'Add',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-add/user-add.component').then(
        (m) => m.AddUserComponent,
      ),
    title: 'Add User',
  },
  {
    path: 'Edit/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent,
      ),
    title: 'Edit User',
  },
  
];
