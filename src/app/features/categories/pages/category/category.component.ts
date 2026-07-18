import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  CategoryListApiResponse,
  CategoryStatus,
  CategoryStatusLabels,
} from '../../models/category.model';
import { CommonModule } from '@angular/common';
import {
  TopPageComponent,
} from '../../../../shared/components/top-page/top-page.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { finalize, take } from 'rxjs';
import {
  MdbModalModule,
  MdbModalRef,
  MdbModalService,
} from 'mdb-angular-ui-kit/modal';
import { ManageCategoryComponent } from '../../components/manage-category-modal/manage-category-modal.component';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { CategoryService } from '../../services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { extractErrorResponse } from '../../../../shared/helpers/error.helper';
import {
  confirmDestructiveAction,
  showErrorDialog,
  showSuccessDialog,
} from '../../../../shared/helpers/confirm-dialog.helper';
import { FilterOption } from '../../../../shared/models/filter-options.model';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    TopPageComponent,
    PaginationComponent,
    MdbModalModule,
    CategoryListComponent,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  @ViewChild('categoryList') categoryList!: ElementRef;

  categories?: Category[];
  isLoading: boolean = false;

  pagination: CategoryListApiResponse = {
    pageIndex: 1,
    pageSize: 9,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
  };

  searchTerm: string = '';
  selectedStatus = '';

  filterOptions: FilterOption[] = Object.entries(CategoryStatusLabels).map(
    ([value, label]) => ({ value: label, label }),
  );

  modalRef: MdbModalRef<ManageCategoryComponent> | null = null;

  CategoryStatus = CategoryStatus;
  CategoryStatusLabels = CategoryStatusLabels;

  constructor(
    private readonly catService: CategoryService,
    private readonly toastr: ToastrService,
    private readonly modalService: MdbModalService,
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  getStatusClass(status: CategoryStatus): string {
    switch (status) {
      case CategoryStatus.Active:
        return 'text-success';
      case CategoryStatus.Inactive:
        return 'text-warning';
      case CategoryStatus.Archived:
        return 'text-danger';
      default:
        return '';
    }
  }

  getStatusIcon(status: CategoryStatus): string {
    switch (status) {
      case CategoryStatus.Active:
        return 'bi-check-circle';
      case CategoryStatus.Inactive:
        return 'bi-eye-slash';
      case CategoryStatus.Archived:
        return 'bi-archive';
      default:
        return '';
    }
  }

  trackCategory(index: number, category: any): any {
    return category?.id ? category.id : index;
  }

  loadCategories(): void {
    this.isLoading = true;
    this.catService
      .getPaginated(
        this.pagination.pageIndex,
        this.pagination.pageSize,
        this.searchTerm,
        this.selectedStatus,
      )
      .subscribe({
        next: (response) => {
          this.categories = response.items;
          this.pagination.totalItems = response.totalItems;
          this.pagination.totalPages = response.totalPages;
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

  openModal(category?: Category): void {
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

  async archiveCategory(catId: number) {
    const confirmed = await confirmDestructiveAction({
      confirmButtonText: 'Yes, archive it!',
    });

    if (!confirmed) return;

    this.isLoading = true;
    this.catService
      .archive(catId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          showSuccessDialog('Archived!', 'Category deactivated successfully');
          this.loadCategories();
        },
        error: (err: HttpErrorResponse) => {
          showErrorDialog(
            extractErrorResponse(err, 'Failed to deactivate this Category'),
          );
        },
      });
  }

  searchCategories(term: string): void {
    this.searchTerm = term.trim();
    this.pagination.pageIndex = 1;
    this.loadCategories();
  }

  resetCategories(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.pagination.pageIndex = 1;
    this.loadCategories();
  }

  filterCategories(status: string): void {
    this.selectedStatus = status;
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
