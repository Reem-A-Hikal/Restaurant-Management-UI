import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { BodyComponent } from '../../shared/components/body/body.component';
import { AuthService } from '../../Core/Auth/services/auth.service';
import { ProfileService } from '../../services/profile.service';

interface SideNavToggle {
  screenWidth: number;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [SidebarComponent, BodyComponent],
})
export class DashboardComponent implements OnInit {
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  fullname: string = '';
  ngOnInit() {
    // this.profileService.getUserProfile().subscribe({
    //   next: (res: any) => (this.fullname = res.fullName),
    //   error: (err: any) =>
    //     console.log('error while retrieving user profile:\n', err),
    // });
  }

  onToggleSidenav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.isCollapsed;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
