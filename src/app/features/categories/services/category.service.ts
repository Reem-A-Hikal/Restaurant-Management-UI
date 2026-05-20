import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../../../Core/services/api.service';
import { Category, CategoryCreateDto, CategoryUpdateDto } from '../models/category.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { PaginatedResponse } from '../../../shared/models/pagination.model';
import { HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly basePath = '/category';

  constructor(private readonly api: ApiService) {}

  getAllCats(): Observable<Category[]> {
    return this.api
      .get<ApiResponse<Category[]>>(`${this.basePath}/all`)
      .pipe(map((res) => res.data));
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

    if (searchTerm?.trim()) params = params.set('searchTerm', searchTerm.trim());
    if (selectedFilter) params = params.set('selectedFilter', selectedFilter);

    return this.api
      .get<
        ApiResponse<PaginatedResponse<Category>>
      >(`${this.basePath}/GetAllPaginated`, params)
      .pipe(map((res) => res.data));
  }

  getCatById(id: string): Observable<Category> {
    return this.api
      .get<ApiResponse<Category>>(`${this.basePath}/getcategory/${id}`)
      .pipe(map((res) => res.data));
  }

  create(dto: CategoryCreateDto): Observable<ApiResponse<Category>> {
    return this.api.post<ApiResponse<Category>>(`${this.basePath}/add`, dto);
  }

  update(id: number, dto: CategoryUpdateDto): Observable<ApiResponse<null>> {
    return this.api.put<ApiResponse<null>>(
      `${this.basePath}/update/${id}`,
      dto,
    );
  }

  archive(id: number): Observable<ApiResponse<null>> {
    return this.api.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
  }
}
