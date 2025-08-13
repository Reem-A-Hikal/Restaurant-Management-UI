import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly baseUrl = `${environment.apiBaseUrl}/Address`;

  constructor(private api: ApiService) {}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getUserAddresses(userId: string, customHeaders?: HttpHeaders) {
    const headers = customHeaders || this.getHeaders();
    const url = `${this.baseUrl}/UserAddressesAdmin/${userId}`;
    return this.api.get<any[]>(url, headers);
  }
}
