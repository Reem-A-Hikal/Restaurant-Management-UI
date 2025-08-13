import { Router } from '@angular/router';
import { AuthService } from '../../Core/Auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [],
})
export class MainComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/signin');
  }
}
