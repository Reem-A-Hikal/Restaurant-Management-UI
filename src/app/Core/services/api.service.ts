import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  get<T>(
    url: string,
    params?: HttpParams,
    context?: HttpContext,
  ): Observable<T> {
    return this.http.get<T>(`${environment.apiBaseUrl}${url}`, {
      params,
      context,
    });
  }

  post<T>(url: string, body: unknown, context?: HttpContext): Observable<T> {
    return this.http.post<T>(`${environment.apiBaseUrl}${url}`, body, {
      context,
    });
  }

  put<T>(url: string, body: unknown, context?: HttpContext): Observable<T> {
    return this.http.put<T>(`${environment.apiBaseUrl}${url}`, body, {
      context,
    });
  }

  patch<T>(url: string, body: unknown, context?: HttpContext): Observable<T> {
    return this.http.patch<T>(`${environment.apiBaseUrl}${url}`, body, {
      context,
    });
  }

  delete<T>(url: string, context?: HttpContext): Observable<T> {
    return this.http.delete<T>(`${environment.apiBaseUrl}${url}`, { context });
  }
}
