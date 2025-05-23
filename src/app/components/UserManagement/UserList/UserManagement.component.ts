import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../models/services/api.service';
import { User } from '../../../Core/Auth/models/User';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../Core/Auth/services/auth.service';
import { UserService } from '../../../models/services/User.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-UserManagement',
  standalone: false,
  templateUrl: './UserManagement.component.html',
  styleUrls: ['./UserManagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  filteredUsers: User[] = [];
  searchTerm = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastr.error('Failed to load users', 'Error');
        this.isLoading = false;
      },
    });
  }
  @Input() isCollapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';
    if (this.isCollapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.isCollapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  viewDetails(id: string): void {
    this.router.navigate(['/Home/Users/View', id]);
  }
  editUser(id: string) {
    this.router.navigate(['/Home/Users/Edit', id]);
  }
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== userId);
          this.filteredUsers = this.filteredUsers.filter(
            (u) => u.id !== userId
          );
          this.toastr.success('User deleted successfully');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.toastr.error(
            err.error?.message || 'Failed to delete user',
            'Error'
          );
          this.isLoading = false;
        },
      });
    }
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.fullName?.toLowerCase().includes(term)
    );
  }
}
