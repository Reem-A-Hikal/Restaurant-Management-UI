import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { PaymentDto } from '../models/payment.model';
import { Observable } from 'rxjs';
import { SKIP_ERROR_TOAST } from '../../../shared/tokens/skip-error-toast.token';
import { HttpContext } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private readonly basePath = '/payment';
  private readonly skip = new HttpContext().set(SKIP_ERROR_TOAST, true);

  constructor(private readonly api: ApiService) {}

  getHistory(orderId: number): Observable<PaymentDto[]> {
    return this.api.get<PaymentDto[]>(
      `${this.basePath}/orders/${orderId}`,
      undefined,
      this.skip,
    );
  }

  refund(orderId: number, gatewayResponse?: string): Observable<PaymentDto> {
    const query = gatewayResponse
      ? `?gatewayResponse=${encodeURIComponent(gatewayResponse)}`
      : '';
    return this.api.post<PaymentDto>(
      `${this.basePath}/orders/${orderId}/refund${query}`,
      {},
      this.skip,
    );
  }
}
