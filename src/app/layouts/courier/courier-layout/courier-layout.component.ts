import { AuthService } from './../../../Core/Auth/services/auth.service';
import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CourierActivityService } from '../../../features/deliveries/services/courier-activity.service';

@Component({
  selector: 'app-courier-layout',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './courier-layout.component.html',
  styleUrls: ['./courier-layout.component.css'],
})
export class CourierLayoutComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly courierActivity: CourierActivityService,
  ) {}

  get activeCount$() {
    return this.courierActivity.count$;
  }

  get firstName(): string {
    const fullName = this.authService.getCurrentUserFullName();
    return fullName?.split(' ')[0] ?? '';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}