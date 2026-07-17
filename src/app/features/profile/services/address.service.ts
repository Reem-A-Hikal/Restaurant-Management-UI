import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly baseUrl = `/Address`;

  constructor(private readonly api: ApiService) {}

  getUserAddresses(userId: string): Observable<Address[]> {
    return this.api.get<Address[]>(`${this.baseUrl}/user/${userId}`);
  }
}
