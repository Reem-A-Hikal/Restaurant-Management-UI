import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../Core/Auth/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  currentPageTitle = 'Dashboard';
  searchQuery = '';
  userName! :string;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = this.auth.getCurrentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}
