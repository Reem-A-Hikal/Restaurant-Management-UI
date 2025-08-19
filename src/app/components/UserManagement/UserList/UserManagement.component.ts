import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../Core/Auth/models/User';
import { UserService } from '../../../services/User.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../modal/modal.component';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-UserManagement',
  standalone: true,
  imports: [MdbModalModule, CommonModule, FormsModule, MdbTooltipModule],
  templateUrl: './UserManagement.component.html',
  styleUrls: ['./UserManagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  filteredUsers: User[] = [];
  searchTerm = '';

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: MdbModalService
  ) {}

  // Inputs for sidebar and responsive design
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

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // console.log('Users loaded:', users);
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

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  openModal(id: string): void {
    this.modalRef = this.modalService.open(ModalComponent);
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
      this.reset();
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.fullName?.toLowerCase().includes(term)
    );
  }

  reset(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }
}
