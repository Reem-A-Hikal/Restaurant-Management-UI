import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5181/api/account';

  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(`${this.apiUrl}/register`, formData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
