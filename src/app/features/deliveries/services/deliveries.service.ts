import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import {
  AssignDeliveryDto,
  CancelDeliveryDto,
  UpdateLocationDto,
} from '../models/delivery-requests.model';
import { Observable } from 'rxjs';
import {
  AvailableDeliveryPersonDto,
  DeliveryDto,
} from '../models/delivery.model';
import { SKIP_ERROR_TOAST } from '../../../shared/tokens/skip-error-toast.token';
import { HttpContext } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DeliveriesService {
  private readonly basePath = '/Delivery';
  private readonly skip = new HttpContext().set(SKIP_ERROR_TOAST, true);

  constructor(private readonly api: ApiService) {}

  assign(orderId: number, dto: AssignDeliveryDto): Observable<DeliveryDto> {
    return this.api.post<DeliveryDto>(
      `${this.basePath}/assign/${orderId}`,
      dto,
      this.skip,
    );
  }

  getActiveForOrder(orderId: number): Observable<DeliveryDto | null> {
    return this.api.get<DeliveryDto | null>(
      `${this.basePath}/order/${orderId}/active`,
      undefined,
      this.skip,
    );
  }

  getAllActive(): Observable<DeliveryDto[]> {
    return this.api.get<DeliveryDto[]>(`${this.basePath}/active`);
  }

  getHistoryForOrder(orderId: number): Observable<DeliveryDto[]> {
    return this.api.get<DeliveryDto[]>(
      `${this.basePath}/order/${orderId}/history`,
      undefined,
      this.skip,
    );
  }

  getAvailablePersons(): Observable<AvailableDeliveryPersonDto[]> {
    return this.api.get<AvailableDeliveryPersonDto[]>(
      `${this.basePath}/available-persons`,
      undefined,
      this.skip,
    );
  }

  getMyDeliveries(): Observable<DeliveryDto[]> {
    return this.api.get<DeliveryDto[]>(`${this.basePath}/my-deliveries`);
  }

  markPickedUp(deliveryId: number): Observable<DeliveryDto> {
    return this.api.put<DeliveryDto>(
      `${this.basePath}/${deliveryId}/pickup`,
      {},
    );
  }

  markDelivered(deliveryId: number): Observable<DeliveryDto> {
    return this.api.put<DeliveryDto>(
      `${this.basePath}/${deliveryId}/delivered`,
      {},
    );
  }

  cancelDelivery(
    deliveryId: number,
    dto: CancelDeliveryDto,
  ): Observable<DeliveryDto> {
    return this.api.put<DeliveryDto>(
      `${this.basePath}/${deliveryId}/cancel`,
      dto,
    );
  }

  updateLocation(
    deliveryId: number,
    dto: UpdateLocationDto,
  ): Observable<DeliveryDto> {
    return this.api.put<DeliveryDto>(
      `${this.basePath}/${deliveryId}/location`,
      dto,
    );
  }
}
