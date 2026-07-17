import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { AssignDeliveryDto } from '../models/delivery-requests.model';
import { Observable } from 'rxjs';
import {
  AvailableDeliveryPersonDto,
  DeliveryDto,
} from '../models/delivery.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  private readonly basePath = '/Delivery';

  constructor(private readonly api: ApiService) {}

  assign(orderId: number, dto: AssignDeliveryDto): Observable<DeliveryDto> {
    return this.api.post<DeliveryDto>(
      `${this.basePath}/assign/${orderId}`,
      dto,
    );
  }

  getActiveForOrder(orderId: number): Observable<DeliveryDto | null> {
    return this.api.get<DeliveryDto | null>(
      `${this.basePath}/order/${orderId}/active`,
    );
  }

  getAllActive(): Observable<DeliveryDto[]> {
    return this.api.get<DeliveryDto[]>(`${this.basePath}/active`);
  }

  getHistoryForOrder(orderId: number): Observable<DeliveryDto[]> {
    return this.api.get<DeliveryDto[]>(
      `${this.basePath}/order/${orderId}/history`,
    );
  }

  getAvailablePersons(): Observable<AvailableDeliveryPersonDto[]> {
    return this.api.get<AvailableDeliveryPersonDto[]>(
      `${this.basePath}/available-persons`,
    );
  }
}
