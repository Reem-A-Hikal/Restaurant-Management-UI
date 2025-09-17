import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/Category';
import { ApiResponse } from '../models/ApiResponse';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private api: ApiService) {}
  private readonly basePath = '/Category';

  getAllCats(): Observable<Category[]> {
    return this.api.get<Category[]>(`${this.basePath}/all`);
  }

  getPaginatedCats(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedFilter?: string
  ): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (selectedFilter) params = params.set('selectedRole', selectedFilter);
    return this.api.get<ApiResponse>(`${this.basePath}/GetAllPaginated`, params);
  }

  getCatById(id: string): Observable<Category> {
    return this.api.get<Category>(`${this.basePath}/${id}`);
  }

  createCat(product: Category): Observable<Category> {
    return this.api.post<Category>(this.basePath, product);
  }

  updateCat(id: string, product: Category): Observable<Category> {
    return this.api.put<Category>(`${this.basePath}/${id}`, product);
  }

  deleteCat(id: string): Observable<void> {
    return this.api.delete(`${this.basePath}/${id}`);
  }
}
