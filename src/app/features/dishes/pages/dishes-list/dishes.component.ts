import { DishesListApiResponse, DishWithId } from '../../models/dish';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TopPageComponent } from '../../../../shared/components/top-page/top-page.component';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DishesService } from '../../services/dishes.service';
import { AddCardComponent } from '../../../../shared/components/add-card/add-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [
    CurrencyPipe,
    PaginationComponent,
    CommonModule,
    TopPageComponent,
    AddCardComponent,
    EmptyStateComponent
  ],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  dishes!: DishWithId[];
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedFilter: string = 'All';

  get isEmpty(): boolean {
    return !this.isLoading && (this.dishes?.length ?? 0) === 0;
  }

  filterOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Unavailable', label: 'Unavailable' },
  ];

  pagination: DishesListApiResponse = {
    pageIndex: 1,
    pageSize: 6,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  constructor(
    private readonly dishesService: DishesService,
    private readonly toastr: ToastrService,
  ) {}
  ngOnInit() {
    this.loadDishes();
  }
  loadDishes(): void {
    this.isLoading = true;
    let term = this.searchTerm.trim();
    let filter = this.selectedFilter;
    this.dishesService
      .getPaginatedProducts(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        term,
        filter,
      )
      .subscribe({
        next: (res) => {
          this.dishes = res.data.items;
          this.pagination = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to load dishes', 'Error');
          this.isLoading = false;
        },
      });
  }

  onPageChange(newPage: number): void {
    this.pagination.pageIndex = newPage;
    this.loadDishes();
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackDish(index: number, dishId: any): any {
    return dishId?.Id ? dishId.Id : index;
  }

  addDish() {}
  editDish(dishId: number, dish: DishWithId) {}

  async deleteDish(dishId: number) {
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
      this.dishesService
        .deleteProduct(dishId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            console.log(res);

            Swal.default.fire({
              title: 'Deleted!',
              text: res.message || 'dish deactivated successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });
            this.loadDishes();
          },
          error: (err: HttpErrorResponse) => {
            Swal.default.fire({
              title: 'Error!',
              text: err.message || 'Failed to deactivate this dish',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }
  viewDish(dishId: number) {}

  applySearch(term: any) {
    this.searchTerm = String(term || '').trim();
    this.pagination.pageIndex = 1;
    this.loadDishes();
  }

  filterDishes(filter: string) {
    this.selectedFilter = filter;
    this.pagination.pageIndex = 1;
    this.loadDishes();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'All';
    this.pagination.pageIndex = 1;
    this.loadDishes();
  }
}
