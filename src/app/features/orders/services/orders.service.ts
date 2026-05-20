import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../Core/services/api.service';
import { OrderDto } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private readonly api: ApiService) {}
  private readonly basePath = '/Order';

  getAllCats(): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(`${this.basePath}/GetallOrders`);
  }

  getCatById(id: string): Observable<OrderDto> {
    return this.api.get<OrderDto>(`${this.basePath}/${id}`);
  }

  createCat(product: OrderDto): Observable<OrderDto> {
    return this.api.post<OrderDto>(this.basePath, product);
  }

  updateCat(id: string, product: OrderDto): Observable<OrderDto> {
    return this.api.put<OrderDto>(`${this.basePath}/${id}`, product);
  }

  deleteCat(id: string): Observable<void> {
    return this.api.delete(`${this.basePath}/${id}`);
  }
}
