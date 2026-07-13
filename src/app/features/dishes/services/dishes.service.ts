import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../Core/services/api.service';
import {
  CreateDishRequest,
  DishesListApiResponse,
  DishWithId,
  UpdateDishRequest,
} from '../models/dish.model';

@Injectable({
  providedIn: 'root',
})
export class DishesService {
  constructor(private readonly api: ApiService) {}

  private readonly basePath = '/Product';

  getAll(): Observable<DishWithId[]> {
    return this.api.get<DishWithId[]>(`${this.basePath}/all`);
  }

  getPaginated(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedFilter: string = 'All',
  ): Observable<DishesListApiResponse> {
    let params: HttpParams = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm.trim());
    if (selectedFilter) params = params.set('selectedFilter', selectedFilter);

    return this.api.get<DishesListApiResponse>(
      `${this.basePath}/paginated`,
      params,
    );
  }

  getById(id: number): Observable<DishWithId> {
    return this.api.get<DishWithId>(`${this.basePath}/GetProduct/${id}`);
  }

  getByCategory(id: number): Observable<DishWithId[]> {
    return this.api.get<DishWithId[]>(`${this.basePath}/Category/${id}`);
  }

  create(dish: CreateDishRequest): Observable<{ productId: number }> {
    return this.api.post<{ productId: number }>(
      `${this.basePath}/AddProduct`,
      dish,
    );
  }

  update(id: number, dish: UpdateDishRequest): Observable<void> {
    return this.api.put<void>(`${this.basePath}/EditProduct/${id}`, dish);
  }

  delete(id: number): Observable<number> {
    return this.api.delete<number>(`${this.basePath}/Delete/${id}`);
  }
}
