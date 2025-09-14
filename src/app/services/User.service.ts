import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User, UserListApiResponse } from '../Core/Auth/models/User';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly basePath = `/user`;

  constructor(private api: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(`${this.basePath}/GetAll`);
  }

  getAllPaginatedUsers(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedRole?: string
  ): Observable<UserListApiResponse> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (selectedRole) params = params.set('selectedRole', selectedRole);
    return this.api.get<UserListApiResponse>(
      `${this.basePath}/GetAllPaginated`,
      params
    );
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

  addUser(user: User): Observable<any> {
    return this.api.post<User>(`${this.basePath}`, user);
  }
}
