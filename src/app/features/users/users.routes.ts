import { Routes } from '@angular/router';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then(
        (m) => m.UserListComponent,
      ),
    title: 'Staff',
  },
  {
    path: 'Add',
    loadComponent: () =>
      import('./pages/user-add/user-add.component').then(
        (m) => m.AddUserComponent,
      ),
    title: 'Add User',
  },
  {
    path: 'Edit/:id',
    loadComponent: () =>
      import('./pages/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent,
      ),
    title: 'Edit User',
  },
];
