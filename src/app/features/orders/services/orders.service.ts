import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../Core/services/api.service';
import { OrderDto } from '../models/order.model';
import { OrderStatus } from '../models/order-enums';
import {
  CancelOrderDto,
  ConfirmOrderDto,
  CreateOrderDetailDto,
} from '../models/order-requests.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly basePath = '/Order';

  constructor(private readonly api: ApiService) {}

  // ---- Reads ----

  getById(id: number): Observable<OrderDto> {
    return this.api.get<OrderDto>(`${this.basePath}/${id}`);
  }

  getAll(): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(this.basePath);
  }

  getByCustomer(customerId: string): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(`${this.basePath}/customer/${customerId}`);
  }

  getMyOrders(): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(`${this.basePath}/my-orders`);
  }

  getAllowedStatuses(): Observable<OrderStatus[]> {
  return this.api.get<OrderStatus[]>(`${this.basePath}/allowed-statuses`);
}

  getByStatus(status: OrderStatus): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(`${this.basePath}/status/${status}`);
  }

  getKitchenQueue(): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(`${this.basePath}/kitchen-queue`);
  }

  getByDateRange(startDate: string, endDate: string): Observable<OrderDto[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.api.get<OrderDto[]>(`${this.basePath}/date-range`, params);
  }

  // ---- Stats ----

  getDailyRevenue(date: string): Observable<number> {
    return this.api.get<number>(`${this.basePath}/revenue/${date}`);
  }

  getOrderCountByStatus(status: OrderStatus): Observable<number> {
    return this.api.get<number>(`${this.basePath}/count/${status}`);
  }

  // ---- Writes / State transitions ----

  confirm(id: number, dto: ConfirmOrderDto): Observable<OrderDto> {
    return this.api.patch<OrderDto>(`${this.basePath}/${id}/confirm`, dto);
  }

  cancel(id: number, dto: CancelOrderDto): Observable<OrderDto> {
    return this.api.patch<OrderDto>(`${this.basePath}/${id}/cancel`, dto);
  }

  markAsPreparing(id: number): Observable<OrderDto> {
    return this.api.patch<OrderDto>(`${this.basePath}/${id}/preparing`, {});
  }

  markAsPrepared(id: number): Observable<OrderDto> {
    return this.api.patch<OrderDto>(`${this.basePath}/${id}/prepared`, {});
  }

  // ---- Items ----

  addItem(orderId: number, item: CreateOrderDetailDto): Observable<OrderDto> {
    return this.api.post<OrderDto>(`${this.basePath}/${orderId}/items`, item);
  }

  removeItem(orderId: number, productId: number): Observable<OrderDto> {
    return this.api.delete<OrderDto>(
      `${this.basePath}/${orderId}/items/${productId}`,
    );
  }
}
