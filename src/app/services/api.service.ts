import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  //get
  get<T>(url: string, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${environment.apiBaseUrl}${url}`);
  }

  //post
  post<T>(url: string, body: any, customHeaders?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${environment.apiBaseUrl}${url}`, body);
  }

  //put
  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.apiBaseUrl}${url}`, body);
  }

  //delete
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiBaseUrl}${url}`);
  }
}
