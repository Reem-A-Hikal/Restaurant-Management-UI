import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TopDish } from '../../models/dashboard-stats.model';
import { toAssetUrl } from '../../../../shared/helpers/url.helper';

@Component({
  selector: 'app-top-dishes-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './top-dishes-card.component.html',
  styleUrls: ['./top-dishes-card.component.css'],
})
export class TopDishesCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() dishes: TopDish[] = [];
  @Input() isLoading = false;

  @Input() maxItems?: number;

  @Input() imageBaseUrl = '';

  private readonly failedImages = new Set<number>();
  toAssetUrl = toAssetUrl;

  get visibleDishes(): TopDish[] {
    return this.maxItems ? this.dishes.slice(0, this.maxItems) : this.dishes;
  }

  get skeletonRows(): number[] {
    return Array.from({ length: this.maxItems ?? 5 });
  }

  hasImage(dish: TopDish): boolean {
    return !!dish.imageUrl && !this.failedImages.has(dish.productId);
  }

  onImageError(dish: TopDish): void {
    this.failedImages.add(dish.productId);
  }
}
