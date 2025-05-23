import { UserService } from './../models/user/services/user.service';
import { AuthService } from './../Core/Auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

interface SideNavToggle {
  screenWidth: number;
  isCollapsed: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [ComponentsModule, SidebarComponent ],
})
export class DashboardComponent implements OnInit {
  isSideNavCollapsed: boolean = false;
  screenWidth: number = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  fullname: string = '';
  ngOnInit() {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => (this.fullname = res.fullName),
      error: (err: any) =>
        console.log('error while retrieving user profile:\n', err),
    });
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
