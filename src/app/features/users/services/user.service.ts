import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { map, Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { PaginatedResponse } from '../../../shared/models/pagination.model';
import { AdminUpdateRequest, CreateUserRequest, UpdateProfileRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly basePath = `/user`;

  constructor(private readonly api: ApiService) {}

  getAllUsers(): Observable<User[]> {
    return this.api
      .get<ApiResponse<User[]>>(`${this.basePath}/GetAll`)
      .pipe(map((res) => res.data));
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

    return this.api
      .get<
        ApiResponse<PaginatedResponse<User>>
      >(`${this.basePath}/GetAllPaginated`, params)
      .pipe(map((res) => res.data));
  }

  getUserById(userId: string): Observable<User> {
    return this.api
      .get<ApiResponse<User>>(`${this.basePath}/GetUserById/${userId}`)
      .pipe(map((res) => res.data));
  }

  adminUpdateUser(
    userId: string,
    data: AdminUpdateRequest,
  ): Observable<ApiResponse<null>> {
    return this.api.put<ApiResponse<null>>(
      `${this.basePath}/AdminUpdate/${userId}`,
      data,
    );
  }

  updateProfile(
    userId: string,
    data: UpdateProfileRequest,
  ): Observable<ApiResponse<null>> {
    return this.api.put<ApiResponse<null>>(
      `${this.basePath}/UpdateProfile/${userId}`,
      data,
    );
  }

  deleteUser(userId: string): Observable<ApiResponse<string>> {
    return this.api.delete<ApiResponse<string>>(
      `${this.basePath}/DeleteUser/${userId}`,
    );
  }

  addUser(
    user: CreateUserRequest,
  ): Observable<ApiResponse<{ userId: string }>> {
    return this.api.post<ApiResponse<{ userId: string }>>(
      `${this.basePath}`,
      user,
    );
  }
}
