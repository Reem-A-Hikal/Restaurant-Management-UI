import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root',
})
export class CatService {
  constructor(private api: ApiService) {}
  private readonly basePath = '/Category';

  getAllCats(): Observable<Category[]> {
    return this.api.get<Category[]>(`${this.basePath}/all`);
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
