import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${environment.apiBaseUrl}${url}`, { params });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${environment.apiBaseUrl}${url}`, body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${environment.apiBaseUrl}${url}`, body);
  }

  patch<T>(url: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${environment.apiBaseUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiBaseUrl}${url}`);
  }
}
