import { User } from './../models/User';
import { AuthResponse } from './../models/AuthResponse';
import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../models/UserProfile';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_profile';

  constructor(private http: HttpClient) {}

  createUser(formData: any): Observable<any> {
    return this.http.post(
      environment.apiBaseUrl + `/account/register`,
      formData,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  login(formatDate: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(environment.apiBaseUrl + `/account/login`, formatDate)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.saveAuhData(response);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
  if (!token) return false;
  return true;
  }

  getUserProfile(): UserProfile | null {
    const userDate = localStorage.getItem(this.USER_KEY);
    return userDate ? JSON.parse(userDate) : null;
  }

  getCurrentUser(): string | 'User' {
    return this.getUserProfile()?.email || 'User';
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private saveAuhData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);

    const userProfile: UserProfile = {
      id: authResponse.userId,
      email: authResponse.email,
      roles: authResponse.roles || [],
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));
  }

  isAdmin(): boolean {
    const user = this.getUserProfile();
    return user?.roles.includes('Admin') ?? false;
  }

  hasRole(role: string): boolean {
    const user = this.getUserProfile();
    return user ? user.roles.includes(role) : false;
  }
}
