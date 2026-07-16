import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/category/category.component').then(
        (m) => m.CategoryComponent,
      ),
    title: 'Categories',
  },
];
