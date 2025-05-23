import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  //get

  get<T>(url: string, customHeaders?: HttpHeaders): Observable<T> {
    const headers = customHeaders || this.getHeaders();
    return this.http.get<T>(`${environment.apiBaseUrl}${url}`, { headers });
  }

  //post
  post<T>(url: string, body: any, customHeaders?: HttpHeaders): Observable<T> {
    const headers = customHeaders || this.getHeaders();
    return this.http.post<T>(`${environment.apiBaseUrl}${url}`, body, {
      headers,
    });
  }

  //put

  put<T>(url: string, body: any, customHeaders?: HttpHeaders): Observable<T> {
    const headers = customHeaders || this.getHeaders();
    return this.http.put<T>(`${environment.apiBaseUrl}${url}`, body, {
      headers,
    });
  }

  //delete

  delete<T>(url: string, customHeaders?: HttpHeaders): Observable<T> {
    const headers = customHeaders || this.getHeaders();
    return this.http.delete<T>(url, { headers });
  }
}
