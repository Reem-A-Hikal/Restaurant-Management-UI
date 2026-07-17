import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/models/pagination.model';
import {
  AdminUpdateRequest,
  CreateUserRequest,
  UpdateProfileRequest,
  User,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly basePath = `/user`;

  constructor(private readonly api: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(`${this.basePath}/GetAll`);
  }

  getAllPaginatedUsers(
    pageIndex: number,
    pageSize: number,
    searchTerm?: string,
    selectedRole?: string,
  ): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm?.trim())
      params = params.set('searchTerm', searchTerm.trim());
    if (selectedRole?.trim())
      params = params.set('selectedRole', selectedRole.trim());

    return this.api.get<PaginatedResponse<User>>(
      `${this.basePath}/GetAllPaginated`,
      params,
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.api.get<User>(`${this.basePath}/GetUserById/${userId}`);
  }

  adminUpdateUser(userId: string, data: AdminUpdateRequest): Observable<null> {
    return this.api.put<null>(`${this.basePath}/AdminUpdate/${userId}`, data);
  }

  updateProfile(userId: string, data: UpdateProfileRequest): Observable<null> {
    return this.api.put<null>(`${this.basePath}/UpdateProfile/${userId}`, data);
  }

  deleteUser(userId: string): Observable<string> {
    return this.api.delete<string>(`${this.basePath}/${userId}`);
  }

  addUser(user: CreateUserRequest): Observable<{ userId: string }> {
    return this.api.post<{ userId: string }>(`${this.basePath}`, user);
  }
}
