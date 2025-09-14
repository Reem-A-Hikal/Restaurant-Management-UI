import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() totalItems!: number;
  @Input() pageIndex: number = 1;
  @Input() maxVisiblePages: number = 3;

  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  getPages(): number[] {
    const pages: number[] = [];
    const { pageIndex, totalPages, maxVisiblePages } = this;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = pageIndex - half;
      let end = pageIndex + half;

      if (start < 1) {
        start = 1;
        end = maxVisiblePages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.pageIndex) {
      this.pageChange.emit(page);
    }
  }
}
