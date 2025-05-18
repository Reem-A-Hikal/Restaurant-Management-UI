import { Router } from '@angular/router';
import { AuthService } from './../../../Core/Auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('Is Admin:', this.authService.isAdmin());
    console.log('Is Authenticated:', this.authService.isAuthenticated());
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
