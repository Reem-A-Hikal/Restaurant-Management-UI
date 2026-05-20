import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../Core/services/api.service';
import { Dish, DishWithId } from '../models/dish';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class DishesService {
  constructor(private readonly api: ApiService) {}

  private readonly basePath = '/Product';

  getAllProducts(): Observable<DishWithId[]> {
    return this.api.get<DishWithId[]>(`${this.basePath}/all`);
  }

  getPaginatedProducts(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedFilter: string = 'All',
  ): Observable<ApiResponse> {
    let params: HttpParams = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm.trim());
    if (selectedFilter) params = params.set('selectedFilter', selectedFilter);

    return this.api.get<ApiResponse>(`${this.basePath}/paginated`, params);
  }

  getProductById(id: string): Observable<DishWithId> {
    return this.api.get<DishWithId>(`${this.basePath}/GetProduct/${id}`);
  }

  createProduct(dish: Dish): Observable<ApiResponse> {
    return this.api.post<ApiResponse>(`${this.basePath}/AddProduct`, dish);
  }

  updateProduct(id: string, dish: DishWithId): Observable<ApiResponse> {
    return this.api.put<ApiResponse>(
      `${this.basePath}/EditProduct/${id}`,
      dish,
    );
  }

  deleteProduct(id: number): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`${this.basePath}/Delete/${id}`);
  }
}
