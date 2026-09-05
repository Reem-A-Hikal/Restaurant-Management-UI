import { Routes } from '@angular/router';
import { rolesGuard } from '../../Core/Auth/Guards/roles.guard';
import { CourierLayoutComponent } from '../../layouts/courier/courier-layout/courier-layout.component';

export const courierRoutes: Routes = [
  {
    path: '',
    component: CourierLayoutComponent,
    canActivate: [rolesGuard],
    data: { roles: ['DeliveryPerson'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/my-deliveries/my-deliveries.component').then(
            (m) => m.MyDeliveriesComponent,
          ),
        title: 'My Deliveries',
        canActivate: [rolesGuard],
        data: { roles: ['DeliveryPerson'] },
      },
      {
        path: 'Profile',
        loadComponent: () =>
          import('../profile/pages/my-profile/my-profile.component').then(
            (m) => m.MyProfileComponent,
          ),
        title: 'My Profile',
        canActivate: [rolesGuard],
        data: { roles: ['DeliveryPerson'] },
      },
    ],
  },
];
