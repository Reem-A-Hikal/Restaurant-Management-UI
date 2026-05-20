import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  Category,
  CategoryStatus,
  CategoryStatusLabels,
} from '../../models/category.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { FormsModule } from '@angular/forms';
import { AddCardComponent } from "../../../../shared/components/add-card/add-card.component";
import { EmptyStateComponent } from "../../../../shared/components/empty-state/empty-state.component";

export type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryCardComponent, AddCardComponent, EmptyStateComponent],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Input() totalPages = 1;
  @Input() currentPage = 1;

  @Output() addCategory = new EventEmitter<void>();
  @Output() editCategory = new EventEmitter<Category>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  viewMode: ViewMode = 'grid';
  searchQuery = '';
  selectedFilter: string = 'All';

  readonly CategoryStatus = CategoryStatus;
  readonly CategoryStatusLabels = CategoryStatusLabels;

  filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Archived', value: 'Archived' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => this.searchChange.emit(q));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(value: string): void {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  onClearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
    this.filterChange.emit(value);
  }

  onRefresh(): void {
    this.searchChange.emit(this.searchQuery);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
