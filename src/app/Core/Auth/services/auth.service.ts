import { AuthResponse } from '../models/auth-response.model';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '../../../features/users/models/user.model';
import { ApiService } from '../../services/api.service';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_profile';

  constructor(private readonly api: ApiService) {}

  createUser(model: RegisterModel): Observable<null> {
    return this.api.post<null>('/account/register', model);
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/account/login', credentials).pipe(
      tap((response) => {
        if (response?.token) {
          this.saveAuhData(response);
        }
      }),
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
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp > Date.now() / 1000; // Check if token is still valid
    } catch {
      return false;
    }
  }

  getUserProfile(): UserProfile | null {
    const userDate = localStorage.getItem(this.USER_KEY);
    return userDate ? JSON.parse(userDate) : null;
  }

  getCurrentUserEmail(): string {
    return this.getUserProfile()?.email || 'User';
  }

  getCurrentUserFullName(): string {
    return this.getUserProfile()?.fullName || 'User';
  }

  getCurrentUserId(): string | null {
    return this.getUserProfile()?.id || null;
  }

  getRole(): string {
    return this.getUserProfile()?.role ?? '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
  isChef(): boolean {
    return this.getRole() === 'Chef';
  }
  isDeliveryPerson(): boolean {
    return this.getRole() === 'DeliveryPerson';
  }
  isCustomer(): boolean {
    return this.getRole() === 'Customer';
  }
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  private saveAuhData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);

    const userProfile: UserProfile = {
      id: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(userProfile));
  }
}
