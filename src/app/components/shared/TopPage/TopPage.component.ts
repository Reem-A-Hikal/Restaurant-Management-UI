import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  label: string;
  value: string;
}
@Component({
  selector: 'app-TopPage',
  imports: [CommonModule, FormsModule],
  templateUrl: './TopPage.component.html',
  styleUrls: ['./TopPage.component.css'],
})
export class TopPageComponent {
  constructor() {}
  searchTerm: string = '';
  selectedFilter: string = '';

  @Input() searchPlaceholder: string = 'Search';
  @Input() filterOptions: FilterOption[] = [];
  @Input() addButtonLabel: string = 'Add';
  @Input() roles: string[] = [];

  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  onReset() {
    this.searchTerm = '';
    this.selectedFilter = '';
    this.reset.emit();
  }

  onFilterChange() {
    this.filterChange.emit(this.selectedFilter);
  }

  onAdd() {
    this.add.emit();
  }
}
