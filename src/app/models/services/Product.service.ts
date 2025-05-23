import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Product } from '../Products/models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private api: ApiService) {}

  private readonly basePath = '/Product';

  getAllProducts(): Observable<Product[]> {
    return this.api.get<Product[]>(`${this.basePath}/all`);
  }

  getProductById(id: string): Observable<Product> {
  return this.api.get<Product>(`${this.basePath}/${id}`);
}

createProduct(product: Product): Observable<Product> {
  return this.api.post<Product>(this.basePath, product);
}

updateProduct(id: string, product: Product): Observable<Product> {
  return this.api.put<Product>(`${this.basePath}/${id}`, product);
}

deleteProduct(id: string): Observable<void> {
  return this.api.delete(`${this.basePath}/${id}`);
}
}
