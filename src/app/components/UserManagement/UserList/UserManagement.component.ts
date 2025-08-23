import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User, UserListApiResponse } from '../../../Core/Auth/models/User';
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
import { Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-UserManagement',
  standalone: true,
  imports: [
    MdbModalModule,
    CommonModule,
    FormsModule,
    MdbTooltipModule,
    PaginationComponent,
  ],
  templateUrl: './UserManagement.component.html',
  styleUrls: ['./UserManagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild('UsersContainer') UsersContainer!: ElementRef;
  @ViewChild('PaginationRef') PaginationRef!: ElementRef;

  users: User[] = [];
  isLoading = false;
  filteredUsers: User[] = [];
  pagination: UserListApiResponse = {
    pageIndex: 1,
    pageSize: 6,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };
  searchTerm = '';
  selectedRole: string = 'All';
  roles: string[] = ['All', 'Admin', 'Customer', 'Chef', 'DeliveryPerson']; // Example roles, adjust as needed

  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: MdbModalService,
    private router: Router
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

  get isEmpty(): boolean {
    return this.filteredUsers.length === 0;
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.filteredUsers = [];
    this.userService
      .getAllUsers(this.pagination.pageIndex, this.pagination.pageSize)
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.users = response.items;
          this.filteredUsers = response.items;
          this.pagination.totalItems = response.totalItems;
          this.pagination.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          // console.log(err);
          this.toastr.error('Failed to load users', 'Error');
          this.isLoading = false;
        },
      });
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  openModal(user: User): void {
    this.modalRef = this.modalService.open(ModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: { user, title: 'User Details' },
    });
  }

  viewDetails(id: string): void {
    this.router.navigateByUrl(`Dashboard/Users/Edit/${id}`);
  }
  deleteUser(userId: string): any {
    if (confirm('Are you sure you want to delete this user?') == true) {
      this.isLoading = true;
      // console.log('Deleting user with ID:', userId);
      this.userService
        .deleteUser(userId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            // console.log(res);
            this.loadUsers(); // Refresh the user list after deletion
            this.toastr.success(
              res.message || 'User deleted successfully',
              'Success'
            );
          },
          error: (err) => {
            // console.log(err);
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
    // console.log(this.PaginationRef);

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter((user) => user.fullName?.toLowerCase().includes(term));
    }

    if (this.selectedRole && this.selectedRole !== 'All') {
      data = data.filter((user) => user.roles.includes(this.selectedRole));
    }

    this.filteredUsers = data;
    // console.log(this.filteredUsers);

    if (this.filteredUsers.length === 0) {
      this.toastr.info('No users found matching the search criteria', 'Info');
    }
  }

  reset(): void {
    this.searchTerm = '';
    this.filteredUsers = [...this.users];
  }

  // // Pagination Logic
  // getPages(): number[] {
  //   const pages: number[] = [];
  //   const maxVisiblePages = 3;
  //   const { pageIndex, totalPages } = this.pagination;

  //   if (totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     const half = Math.floor(maxVisiblePages / 2);
  //     let start = pageIndex - half;
  //     let end = pageIndex + half;

  //     if (start < 1) {
  //       start = 1;
  //       end = maxVisiblePages;
  //     }

  //     if (end > totalPages) {
  //       end = totalPages;
  //       start = Math.max(1, end - maxVisiblePages + 1);
  //     }

  //     for (let i = start; i <= end; i++) {
  //       pages.push(i);
  //     }
  //   }
  //   return pages;
  // }

  // trackByPage(index: number, page: number): number {
  //   return page;
  // }

  onPageChange(page: number): void {
    this.pagination.pageIndex = page;
    this.loadUsers();
    this.scrollTop();
  }

  private scrollTop() {
    setTimeout(() => {
      this.UsersContainer?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }
}
