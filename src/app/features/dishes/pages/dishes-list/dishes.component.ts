import { CategoryService } from './../../../categories/services/category.service';
import {
  DishesListApiResponse,
  DishWithId,
  ProductStatus,
} from '../../models/dish.model';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TopPageComponent } from '../../../../shared/components/top-page/top-page.component';
import { finalize, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DishesService } from '../../services/dishes.service';
import { AddCardComponent } from '../../../../shared/components/add-card/add-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { Category } from '../../../categories/models/category.model';
import { extractErrorResponse } from '../../../../shared/helpers/error.helpers';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { ManageDishModalComponent } from '../../components/manage-dish-modal/manage-dish-modal.component';
import { toAssetUrl } from '../../../../shared/helpers/url.helpers';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [
    CurrencyPipe,
    PaginationComponent,
    CommonModule,
    TopPageComponent,
    AddCardComponent,
    EmptyStateComponent,
    MdbModalModule,
  ],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css'],
})
export class DishesComponent implements OnInit {
  dishes!: DishWithId[];
  categories!: Category[];
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedFilter: string = 'All';
  selectedCategoryId: any = null;
  readonly ProductStatus = ProductStatus;
  toAssetUrl = toAssetUrl;

  modalRef: MdbModalRef<ManageDishModalComponent> | null = null;

  get isEmpty(): boolean {
    return !this.isLoading && (this.dishes?.length ?? 0) === 0;
  }

  filterOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Unavailable', label: 'Unavailable' },
  ];

  pagination: DishesListApiResponse = {
    pageIndex: 1,
    pageSize: 9,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  constructor(
    private readonly dishesService: DishesService,
    private readonly categoryService: CategoryService,
    private readonly toastr: ToastrService,
    private readonly modalService: MdbModalService,
  ) {}
  ngOnInit() {
    this.loadDishes();
    this.loadCategories();
  }
  loadDishes(): void {
    this.isLoading = true;
    let term = this.searchTerm.trim();
    let filter = this.selectedFilter;
    this.dishesService
      .getPaginated(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        term,
        filter,
      )
      .subscribe({
        next: (res) => {
          this.dishes = res.items;
          this.pagination = res;
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(
            extractErrorResponse(err, 'Failed to load dishes'),
            'Error',
          );
          this.isLoading = false;
        },
      });
  }

  loadCategories() {
    this.categoryService.getAllCats().subscribe({
      next: (res) => {
        this.categories = res;
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

  trackDish(index: number, dish: DishWithId): any {
    return dish?.productId ? dish.productId : index;
  }

  openDishModal(dish?: DishWithId): void {
    this.modalRef = this.modalService.open(ManageDishModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        dishToEdit: dish,
        categories: this.categories,
        title: dish ? 'Edit Dish' : 'Add New Dish',
      },
    });

    this.modalRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result === 'success') {
        this.refreshCurrentView();
      }
    });
  }

  addDish() {
    this.openDishModal();
  }

  editDish(dishId: number, dish: DishWithId) {
    this.openDishModal(dish);
  }

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
        .delete(dishId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: () => {
            Swal.default.fire({
              title: 'Deleted!',
              text: 'Dish deactivated successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });
            this.refreshCurrentView();
          },
          error: (err: HttpErrorResponse) => {
            Swal.default.fire({
              title: 'Error!',
              text: extractErrorResponse(err, 'Failed to deactivate this dish'),
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }
  viewDish(dishId: number) {
    console.log('From View', dishId);
  }

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

  selectCategory(id: any) {
    if (id == null) {
      this.loadDishes();
      this.selectedCategoryId = null;
      return;
    }
    this.dishesService.getByCategory(id).subscribe({
      next: (res) => {
        this.dishes = res;
        this.selectedCategoryId = id;
      },
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'All';
    this.pagination.pageIndex = 1;
    this.loadDishes();
  }

  private refreshCurrentView(): void {
    if (this.selectedCategoryId != null) {
      this.selectCategory(this.selectedCategoryId);
    } else {
      this.loadDishes();
    }
  }
}
