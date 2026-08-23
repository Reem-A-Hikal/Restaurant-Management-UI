import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReviewDto } from '../../../reviews/models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-review-panel',
  imports: [CommonModule],
  templateUrl: './order-review-panel.component.html',
  styleUrls: ['./order-review-panel.component.css'],
})
export class OrderReviewPanelComponent {
  @Input() review: ReviewDto | null = null;
  @Input() isLoading = false;
  @Input() isDeleting = false;
  @Input() orderDelivered = false;

  @Output() deleteReview = new EventEmitter<void>();

  readonly stars = [1, 2, 3, 4, 5];
}
