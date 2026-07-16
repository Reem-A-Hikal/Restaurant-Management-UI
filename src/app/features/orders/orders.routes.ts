import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order/order.component').then((m) => m.OrderComponent),
    title: 'Orders',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent,
      ),
    title: 'Order Details',
  },
];
