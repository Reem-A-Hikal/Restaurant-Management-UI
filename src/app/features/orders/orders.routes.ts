import { Routes } from '@angular/router';
import { adminGuard } from '../../Core/Auth/Guards/admin.guard';

export const ordersRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/order/order.component').then((m) => m.OrderComponent),
    title: 'Orders',
  },
  {
    path: ':id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent,
      ),
    title: 'Order Details',
  },
];
