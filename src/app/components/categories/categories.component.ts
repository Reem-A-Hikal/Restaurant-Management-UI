import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Category,
  CategoryListApiResponse,
  CategoryWithId,
} from '../../models/Category';
import { CommonModule } from '@angular/common';
import {
  FilterOption,
  TopPageComponent,
} from '../shared/TopPage/TopPage.component';
import { CategoryService } from '../../services/Category.service';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, TopPageComponent, PaginationComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
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
  selectedFilter: string = '';

  filterOptions: FilterOption[] = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  constructor(
    private catService: CategoryService,
    private toastr: ToastrService
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
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error("Failed to load categories", 'Error');
          this.isLoading = false;
        },
      });
  }

  get isEmpty(): boolean {
    return this.categories?.length === 0;
  }

  addCategory(): void {}

  editCategory(cat: Category): void {}

  deleteCategory(cat: Category): void {}

  searchCategories(term: string): void {
    if (!term) {
      this.loadCategories();
      return;
    }
  }

  resetCategories(): void {
    this.loadCategories();
  }

  filterCategories(filter: string): void {
    if (!filter) {
      this.loadCategories();
      return;
    }
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
