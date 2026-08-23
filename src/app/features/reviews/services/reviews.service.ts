import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import {
  CreateReviewDto,
  ProductReviewsResponse,
  ReviewDto,
  UpdateReviewDto,
} from '../models/review.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly basePath = '/Review';

  constructor(private readonly api: ApiService) {}

  getByOrder(orderId: number): Observable<ReviewDto | null> {
    return this.api.get<ReviewDto | null>(`${this.basePath}/order/${orderId}`);
  }

  getByCustomer(customerId: string): Observable<ReviewDto[]> {
    return this.api.get<ReviewDto[]>(`${this.basePath}/customer/${customerId}`);
  }

  getByProduct(
    productId: number,
    pageIndex: number = 1,
    pageSize: number = 10,
  ): Observable<ProductReviewsResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.api.get<ProductReviewsResponse>(
      `${this.basePath}/product/${productId}`,
      params,
    );
  }

  create(orderId: number, dto: CreateReviewDto): Observable<ReviewDto> {
    return this.api.post<ReviewDto>(`${this.basePath}/order/${orderId}`, dto);
  }

  update(reviewId: number, dto: UpdateReviewDto): Observable<ReviewDto> {
    return this.api.put<ReviewDto>(`${this.basePath}/${reviewId}`, dto);
  }

  delete(reviewId: number): Observable<void> {
    return this.api.delete<void>(`${this.basePath}/${reviewId}`);
  }
}
