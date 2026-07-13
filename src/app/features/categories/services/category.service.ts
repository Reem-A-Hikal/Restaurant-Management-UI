import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../Core/services/api.service';
import {
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
} from '../models/category.model';
import { PaginatedResponse } from '../../../shared/models/pagination.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly basePath = '/category';

  constructor(private readonly api: ApiService) {}

  getAllCats(): Observable<Category[]> {
    return this.api.get<Category[]>(`${this.basePath}/all`);
  }

  getPaginated(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedFilter?: string,
  ): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm?.trim())
      params = params.set('searchTerm', searchTerm.trim());
    if (selectedFilter) params = params.set('selectedFilter', selectedFilter);

    return this.api.get<PaginatedResponse<Category>>(
      `${this.basePath}/GetAllPaginated`,
      params,
    );
  }

  getCatById(id: string): Observable<Category> {
    return this.api.get<Category>(`${this.basePath}/getcategory/${id}`);
  }

  create(dto: CategoryCreateDto): Observable<Category> {
    return this.api.post<Category>(`${this.basePath}/add`, dto);
  }

  update(id: number, dto: CategoryUpdateDto): Observable<null> {
    return this.api.put<null>(`${this.basePath}/update/${id}`, dto);
  }

  archive(id: number): Observable<null> {
    return this.api.delete<null>(`${this.basePath}/${id}`);
  }
}
