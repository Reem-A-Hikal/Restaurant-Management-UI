import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  CategoryListApiResponse,
  CategoryWithId,
} from '../../../models/Category';
import { CommonModule } from '@angular/common';
import {
  FilterOption,
  TopPageComponent,
} from '../../shared/TopPage/TopPage.component';
import { CategoryService } from '../../../services/Category.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { finalize, take } from 'rxjs';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { ManageCategoryComponent } from '../manageCategoryModal/manageCategory.component';

@Component({
  selector: 'app-categoriesList',
  standalone: true,
  imports: [
    CommonModule,
    TopPageComponent,
    PaginationComponent,
    MdbModalModule,
  ],
  templateUrl: './categoriesList.component.html',
  styleUrls: ['./categoriesList.component.css'],
})
export class CategoriesListComponent implements OnInit {
  @ViewChild('categoryList') categoryList!: ElementRef;

  categories?: CategoryWithId[];
  isLoading: boolean = false;
  pagination: CategoryListApiResponse = {
    pageIndex: 1,
    pageSize: 6,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  searchTerm: string = '';
  selectedFilter: string | undefined = undefined;

  filterOptions: FilterOption[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  modalRef: MdbModalRef<ManageCategoryComponent> | null = null;

  constructor(
    private catService: CategoryService,
    private toastr: ToastrService,
    private modalService: MdbModalService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }
  trackCategory(index: number, category: any): any {
    return category && category.id ? category.id : index;
  }
  loadCategories(): void {
    this.isLoading = true;
    let term = this.searchTerm?.trim();
    let filter = this.selectedFilter;
    this.catService
      .getPaginatedCats(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        term,
        filter
      )
      .subscribe({
        next: (response) => {
          this.categories = response.data.items;
          this.pagination.totalItems = response.data.totalItems;
          this.pagination.totalPages = response.data.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error('Failed to load categories', 'Error');
          this.isLoading = false;
        },
      });
  }

  get isEmpty(): boolean {
    return !this.isLoading && (this.categories?.length ?? 0) === 0;
  }

  openModal(category?: CategoryWithId): void {
    this.modalRef = this.modalService.open(ManageCategoryComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        categoryToEdit: category,
        title: category ? 'Edit Category' : 'Add New Category',
      },
    });

    this.modalRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result === 'success') {
        this.loadCategories();
      }
    });
  }

  async deleteCategory(catId: number) {
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
      this.catService
        .deleteCat(catId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            console.log(res);
            Swal.default.fire({
              title: 'Deleted!',
              text: res.message || 'Category deactivated successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true,
            });
            this.loadCategories();
          },
          error: (err) => {
            Swal.default.fire({
              title: 'Error!',
              text: err.error?.title || 'Failed to deactivate this Category',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }

  searchCategories(term: string): void {
    this.searchTerm = term.trim();
    this.pagination.pageIndex = 1;
    if (term) {
      this.loadCategories();
    }
  }

  resetCategories(): void {
    this.searchTerm = '';
    this.selectedFilter = undefined;
    this.loadCategories();
  }

  filterCategories(filter: string): void {
    this.selectedFilter = filter;
    this.pagination.pageIndex = 1;
    this.loadCategories();
  }

  onPageChange(page: number): void {
    this.pagination.pageIndex = page;
    this.loadCategories();
    this.scrollTop();
  }

  private scrollTop() {
    setTimeout(() => {
      this.categoryList?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }
}
