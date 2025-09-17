import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User, UserListApiResponse } from '../../../models/User';
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
import {
  FilterOption,
  TopPageComponent,
} from '../../shared/TopPage/TopPage.component';

@Component({
  selector: 'app-UserManagement',
  standalone: true,
  imports: [
    MdbModalModule,
    CommonModule,
    FormsModule,
    MdbTooltipModule,
    PaginationComponent,
    TopPageComponent,
  ],
  templateUrl: './UserManagement.component.html',
  styleUrls: ['./UserManagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  @ViewChild('UsersContainer') UsersContainer!: ElementRef;

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
  selectedRole: string = '';
  filterOptions: FilterOption[] = [];
  roles: string[] = ['Admin', 'Customer', 'Chef', 'DeliveryPerson'];

  modalRef: MdbModalRef<ModalComponent> | null = null;

  // Inputs for sidebar and responsive design
  @Input() isCollapsed = false;
  @Input() screenWidth = 0;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private modalService: MdbModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filterOptions =
      this.roles?.map((role) => ({ label: role, value: role })) ?? [];
    this.loadUsersPaginated();
  }

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

  loadUsersPaginated(): void {
    this.isLoading = true;
    let term = this.searchTerm?.trim();
    let role = this.selectedRole;
    this.filteredUsers = [];
    this.userService
      .getAllPaginatedUsers(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        term,
        role
      )
      .subscribe({
        next: (response) => {
          // console.log(response);
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

  addUser(): void {
    this.router.navigateByUrl('Dashboard/Users/Add');
  }

  async deleteUser(userId: string) {
    const Swal = await import('sweetalert2');
    const result = await Swal.default.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      this.isLoading = true;
      this.userService
        .deleteUser(userId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            // console.log(res);
            Swal.default.fire({
              title: 'Deleted!',
              text: res.message || 'User has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });
            this.loadUsersPaginated(); // Refresh the user list after deletion
          },
          error: (err) => {
            Swal.default.fire({
              title: 'Error!',
              text: err.error?.message || 'Failed to delete user',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }

  applyFilter(event: { searchTerm: string; selectedRole: string }): void {
    this.searchTerm = event.searchTerm;
    this.selectedRole = event.selectedRole;
    this.pagination.pageIndex = 1;
    this.loadUsersPaginated();
  }

  reset(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.pagination.pageIndex = 1;
    this.loadUsersPaginated();
  }

  onPageChange(page: number): void {
    this.pagination.pageIndex = page;
    this.loadUsersPaginated();
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
