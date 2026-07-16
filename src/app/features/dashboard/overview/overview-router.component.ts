import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../Core/Auth/services/auth.service';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { ChefOverviewComponent } from './chef-overview/chef-overview.component';

@Component({
  selector: 'app-overview-router',
  standalone: true,
  imports: [CommonModule, AdminOverviewComponent, ChefOverviewComponent],
  template: `
    <app-admin-overview *ngIf="isAdmin"></app-admin-overview>
    <app-chef-overview *ngIf="isChef"></app-chef-overview>
  `,
})
export class OverviewRouterComponent {
  isAdmin: boolean;
  isChef: boolean;

  constructor(private readonly authService: AuthService) {
    this.isAdmin = this.authService.isAdmin();
    this.isChef = this.authService.isChef();
  }
}
