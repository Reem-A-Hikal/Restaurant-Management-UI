import { PaginatedResponse } from '../../../shared/models/pagination.model';

export interface ReviewDto {
  reviewId: number;
  orderId: number;
  customerId: string;
  reviewerName: string;
  rating: number;
  comment: string | null;
  reviewDate: string;
  deliveryRating: number | null;
  foodRating: number | null;
  productId: number | null;
}

export interface CreateReviewDto {
  rating: number;
  comment?: string;
  deliveryRating?: number;
  foodRating?: number;
  productId?: number;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  deliveryRating?: number;
  foodRating?: number;
}

export interface ProductReviewsResponse extends PaginatedResponse<ReviewDto> {}
