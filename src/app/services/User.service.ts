import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../Core/Auth/models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly basePath = `/user`;

  constructor(private api: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(`${this.basePath}/GetAll`);
  }

  getUserById(userId: string): Observable<User> {
    return this.api.get<User>(`${this.basePath}/GetUserById/${userId}`);
  }

  updateUserProfile(userId: string, updateData: any): Observable<any> {
    return this.api.put(`${this.basePath}/UpdateProfile/${userId}`, updateData);
  }

  // Delete user (Admin only)
  deleteUser(userId: string): Observable<any> {
    return this.api.delete<any>(`${this.basePath}/DeleteUser/${userId}`);
  }

  updateUser(userId: string, userData: any): Observable<User> {
    return this.api.put<User>(
      `${this.basePath}/UpdateProfile/${userId}`,
      userData
    );
  }
}
