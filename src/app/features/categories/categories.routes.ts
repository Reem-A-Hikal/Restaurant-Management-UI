import { Routes } from '@angular/router';
import { adminGuard } from '../../Core/Auth/Guards/admin.guard';

export const categoriesRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/category/category.component').then(
        (m) => m.CategoryComponent,
      ),
    title: 'Categories',
  },
];
