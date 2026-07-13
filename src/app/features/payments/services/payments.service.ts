import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { PaymentDto } from '../models/payment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly basePath = '/payment';

  constructor(private readonly api: ApiService) {}

  getHistory(orderId: number): Observable<PaymentDto[]> {
    return this.api.get<PaymentDto[]>(`${this.basePath}/orders/${orderId}`);
  }

  refund(orderId: number, gatewayResponse?: string): Observable<PaymentDto> {
    const query = gatewayResponse
      ? `?gatewayResponse=${encodeURIComponent(gatewayResponse)}`
      : '';
    return this.api.post<PaymentDto>(
      `${this.basePath}/orders/${orderId}/refund${query}`,
      {},
    );
  }
}
