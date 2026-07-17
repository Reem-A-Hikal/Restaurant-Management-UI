import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  FilterOption,
  TopPageComponent,
} from '../../../../shared/components/top-page/top-page.component';
import { PaginatedResponse } from '../../../../shared/models/pagination.model';
import { CardComponent } from '../../components/card/card.component';
import { AddCardComponent } from '../../../../shared/components/add-card/add-card.component';
import { User } from '../../models/user.model';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import {
  confirmDestructiveAction,
  showErrorDialog,
  showSuccessDialog,
} from '../../../../shared/helpers/confirm-dialog.helper';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbTooltipModule,
    PaginationComponent,
    TopPageComponent,
    CardComponent,
    AddCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @ViewChild('UsersContainer') UsersContainer!: ElementRef;

  isLoading = false;
  filteredUsers: User[] = [];

  pagination: PaginatedResponse<User> = {
    pageIndex: 1,
    pageSize: 7,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  searchTerm = '';
  selectedRole = '';
  filterOptions: FilterOption[] = [];
  roles: string[] = ['Customer', 'Chef', 'DeliveryPerson'];

  // Inputs for sidebar and responsive design
  @Input() isCollapsed = false;
  @Input() screenWidth = 0;

  constructor(
    private readonly userService: UserService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.filterOptions = this.roles.map((r) => ({ label: r, value: r }));
    this.loadUsers();
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.filteredUsers.length === 0;
  }

  getBodyClass(): string {
    if (this.isCollapsed && this.screenWidth > 768) return 'body-trimmed';
    if (this.isCollapsed && this.screenWidth <= 768) return 'body-md-screen';
    return '';
  }

  loadUsers(): void {
    this.isLoading = true;
    this.filteredUsers = [];

    this.userService
      .getAllPaginatedUsers(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.searchTerm,
        this.selectedRole,
      )
      .subscribe({
        next: (response) => {
          this.filteredUsers = response.items;
          this.pagination.totalItems = response.totalItems;
          this.pagination.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to load users'),
            'Error',
          );
          this.isLoading = false;
        },
      });
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  editUser(userId: string): void {
    this.router.navigate(['/Dashboard/Staff/Edit', userId]);
  }

  addUser(): void {
    this.router.navigateByUrl('Dashboard/Staff/Add');
  }

  async deleteUser(userId: string) {
    const confirmed = await confirmDestructiveAction({
      text: "You won't be able to revert this!",
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirmed) return;

    this.isLoading = true;
    this.userService
      .deleteUser(userId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          showSuccessDialog('Deleted!', 'User deleted successfully.');
          this.loadUsers();
        },
        error: (err) => {
          showErrorDialog(extractErrorResponse(err, 'Failed to delete user'));
        },
      });
  }

  applyFilter(event: { searchTerm: string; selectedRole: string }): void {
    this.searchTerm = event.searchTerm;
    this.selectedRole = event.selectedRole;
    this.pagination.pageIndex = 1;
    this.loadUsers();
  }

  reset(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.pagination.pageIndex = 1;
    this.loadUsers();
  }

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
    }, 100);
  }
}
