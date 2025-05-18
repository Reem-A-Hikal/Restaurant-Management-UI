import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
  ngOnInit() {
    console.log('Is Admin:', this.authService.isAdmin());
    console.log('Is Authenticated:', this.authService.isAuthenticated());
  }
}
