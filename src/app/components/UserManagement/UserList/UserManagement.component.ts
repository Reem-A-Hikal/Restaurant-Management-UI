import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../Core/Auth/models/User';
import { UserService } from '../../../services/User.service';
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
import { finalize } from 'rxjs';

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
  selectedRole: string = 'All';
  roles: string[] = ['All', 'Admin', 'Customer', 'Chef', 'DeliveryPerson']; // Example roles, adjust as needed

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
  deleteUser(userId: string): any {
    if (confirm('Are you sure you want to delete this user?') == true) {
      this.isLoading = true;
      console.log('Deleting user with ID:', userId);
      this.userService
        .deleteUser(userId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            console.log(res);
            this.loadUsers(); // Refresh the user list after deletion
            this.toastr.success(
              res.message || 'User deleted successfully',
              'Success'
            );
          },
          error: (err) => {
            console.log(err);
            this.toastr.error(
              err.error?.message || 'Failed to delete user',
              'Error'
            );
          },
        });
    }
  }

  applyFilter(): void {
    let data = [...this.users];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter((user) => user.fullName?.toLowerCase().includes(term));
    }

    if (this.selectedRole && this.selectedRole !== 'All') {
      data = data.filter((user) => user.roles.includes(this.selectedRole));
    }

    this.filteredUsers = data;

    if (this.filteredUsers.length === 0) {
      this.toastr.info('No users found matching the search criteria', 'Info');
    }
  }

  reset(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }
}
