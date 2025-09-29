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
    if (selectedFilter) params = params.set('selectedFilter', selectedFilter);
    return this.api.get<ApiResponse>(`${this.basePath}/GetAllPaginated`, params);
  }

  getCatById(id: string): Observable<ApiResponse> {
    return this.api.get<ApiResponse>(`${this.basePath}/getcategory/${id}`);
  }

  createCat(product: Category): Observable<ApiResponse> {
    return this.api.post<ApiResponse>(`${this.basePath}/add`, product);
  }

  updateCat(id: string, product: Category): Observable<ApiResponse> {
    return this.api.put<ApiResponse>(`${this.basePath}/update/${id}`, product);
  }

  deleteCat(id: number): Observable<any> {
    return this.api.delete<any>(`${this.basePath}/delete/${id}`);
  }
}
