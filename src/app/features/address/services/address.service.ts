import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';
import {
  Address,
  AddressCreateDto,
  AddressUpdateDto,
} from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly baseUrl = `/Address`;

  constructor(private readonly api: ApiService) {}

  getUserAddresses(userId: string): Observable<Address[]> {
    return this.api.get<Address[]>(`${this.baseUrl}/user/${userId}`);
  }

  getAddress(userId: string, addressId: number): Observable<Address> {
    return this.api.get<Address>(`${this.baseUrl}/user/${userId}/${addressId}`);
  }

  getDefaultAddress(userId: string): Observable<Address> {
    return this.api.get<Address>(`${this.baseUrl}/user/${userId}/default`);
  }

  create(userId: string, dto: AddressCreateDto): Observable<Address> {
    return this.api.post<Address>(`${this.baseUrl}/user/${userId}`, dto);
  }

  update(userId: string, addressId: number, dto: AddressUpdateDto): Observable<void> {
    return this.api.put<void>(`${this.baseUrl}/user/${userId}/${addressId}`, dto);
  }

  setDefault(userId: string, addressId: number): Observable<void> {
    return this.api.patch<void>(`${this.baseUrl}/user/${userId}/${addressId}/set-default`, {});
  }

  delete(userId: string, addressId: number): Observable<void> {
    return this.api.delete<void>(`${this.baseUrl}/user/${userId}/${addressId}`);
  }
}