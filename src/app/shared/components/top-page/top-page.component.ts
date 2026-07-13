import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-top-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './top-page.component.html',
  styleUrls: ['./top-page.component.css'],
})
export class TopPageComponent {
  constructor() {}
  searchTerm: string = '';
  selectedFilter: string = '';

  @Input() searchPlaceholder: string = 'Search';
  @Input() filterOptions: FilterOption[] = [];
  @Input() addButtonLabel: string = 'Add';

  @Input() pageTitle: string = '';
  @Input() pageSubtitle: string = '';

  @Input() role: string = '';

  @Input() showAddButton: boolean = true;
  @Input() showSearch: boolean = true;

  @Output() searchEvent = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() addEvent = new EventEmitter<void>();
  @Output() resetEvent = new EventEmitter<void>();

  get isSearchDisabled(): boolean {
    return !this.searchTerm || this.searchTerm.trim() === '';
  }

  onSearch() {
    if (!this.isSearchDisabled) {
      this.searchEvent.emit(this.searchTerm.trim());
    }
  }

  onReset() {
    this.searchTerm = '';
    this.selectedFilter = '';
    this.resetEvent.emit();
  }

  onFilterChange() {
    this.filterChange.emit(this.selectedFilter);
  }

  onAdd() {
    this.addEvent.emit();
  }

  onKeyEnter() {
    this.onSearch();
  }
}
