import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Category,
  CategoryIcon,
  CategoryStatus,
  CategoryStatusLabels,
} from '../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css'],
})
export class CategoryCardComponent {
  @Input() category!: Category;

  @Output() edit = new EventEmitter<Category>();
  @Output() delete = new EventEmitter<Category>();
  @Output() addNew = new EventEmitter<void>();

  readonly CategoryStatus = CategoryStatus;
  readonly CategoryStatusLabels = CategoryStatusLabels;

  get statusClass(): string {
    switch (this.category?.status) {
      case CategoryStatus.Active:
        return 'status--active';
      case CategoryStatus.Inactive:
        return 'status--inactive';
      case CategoryStatus.Archived:
        return 'status--archived';
      default:
        return '';
    }
  }

  get categoryIcon(): string {
    const name = this.category?.name
      ?.toLowerCase()
      .replace(/\s+/g, '-') as CategoryIcon;
    return this.iconMap[name] ?? this.iconMap['default'];
  }

  private readonly iconMap: Record<string, string> = {
    appetizers: 'bi bi-egg-fried',
    'main-course': 'bi bi-fork-knife',
    beverages: 'bi bi-cup-straw',
    desserts: 'bi bi-cake',
    salads: 'bi bi-leaf',
    breakfast: 'bi bi-sunrise',
    default: 'bi bi-grid',
  };

  onEdit(): void {
    this.edit.emit(this.category);
  }

  onDelete(): void {
    this.delete.emit(this.category);
  }

  onAddNew(): void {
    this.addNew.emit();
  }
}
