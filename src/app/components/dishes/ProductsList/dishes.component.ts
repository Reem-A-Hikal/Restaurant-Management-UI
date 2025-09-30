import { Component, OnInit } from '@angular/core';
import { DishesService } from '../../../services/Dishes.service';
import { ToastrService } from 'ngx-toastr';
import {
  ProductsListApiResponse,
  ProductWithId,
} from '../../../models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { TopPageComponent } from '../../shared/TopPage/TopPage.component';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CurrencyPipe, PaginationComponent, CommonModule, TopPageComponent],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  products!: ProductWithId[];
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedFilter: string = 'All';

  get isEmpty(): boolean {
    return !this.isLoading && (this.products?.length ?? 0) === 0;
  }

  filterOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Unavailable', label: 'Unavailable' },
  ];

  pagination: ProductsListApiResponse = {
    pageIndex: 1,
    pageSize: 6,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  constructor(
    private dishesService: DishesService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.loadProducts();
  }
  loadProducts(): void {
    this.isLoading = true;
    let term = this.searchTerm.trim();
    let filter = this.selectedFilter;
    this.dishesService
      .getPaginatedProducts(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        term,
        filter
      )
      .subscribe({
        next: (res) => {
          this.products = res.data.items;
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
    this.loadProducts();
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackProduct(index: number, product: any): any {
    return product && product.productId ? product.productId : index;
  }

  addNewProduct() {}
  editProduct(productId: number, product: ProductWithId) {}

  async deleteProduct(productId: number) {
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
        .deleteProduct(productId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            console.log(res);

            Swal.default.fire({
              title: 'Deleted!',
              text: res.message || 'Product deactivated successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });
            this.loadProducts();
          },
          error: (err: HttpErrorResponse) => {
            Swal.default.fire({
              title: 'Error!',
              text: err.message || 'Failed to deactivate this Product',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }
  viewProduct(productId: number) {}

  applySearch(term: string) {
    this.searchTerm = term;
    this.pagination.pageIndex = 1;
    if (term) this.loadProducts();
  }

  filterProducts(filter: string) {
    this.selectedFilter = filter;
    this.pagination.pageIndex = 1;
    this.loadProducts();
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'All';
    this.pagination.pageIndex = 1;
    this.loadProducts();
  }
}
