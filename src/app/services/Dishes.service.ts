import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Product, ProductWithId } from '../models/product';
import { ApiResponse } from '../models/ApiResponse';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DishesService {
  constructor(private api: ApiService) {}

  private readonly basePath = '/Product';

  getAllProducts(): Observable<ProductWithId[]> {
    return this.api.get<ProductWithId[]>(`${this.basePath}/all`);
  }

  getPaginatedProducts(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedFilter: string = 'All'
  ): Observable<ApiResponse> {
    let params: HttpParams = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm.trim());
    if (selectedFilter)
      params = params.set('selectedFilter', selectedFilter);

    return this.api.get<ApiResponse>(`${this.basePath}/paginated`, params);
  }

  getProductById(id: string): Observable<ProductWithId> {
    return this.api.get<ProductWithId>(`${this.basePath}/GetProduct/${id}`);
  }

  createProduct(product: Product): Observable<ApiResponse> {
    return this.api.post<ApiResponse>(`${this.basePath}/AddProduct`, product);
  }

  updateProduct(id: string, product: ProductWithId): Observable<ApiResponse> {
    return this.api.put<ApiResponse>(`${this.basePath}/EditProduct/${id}`, product);
  }

  deleteProduct(id: number): Observable<ApiResponse> {
    return this.api.delete<ApiResponse>(`${this.basePath}/Delete/${id}`);
  }
}
