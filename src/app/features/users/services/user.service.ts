import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';

import { HttpContext, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../shared/models/pagination.model';
import {
  AdminUpdateRequest,
  CreateUserRequest,
  UpdateProfileRequest,
  User,
} from '../models/user.model';
import { SKIP_ERROR_TOAST } from '../../../shared/tokens/skip-error-toast.token';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly basePath = `/user`;
  private readonly skip = new HttpContext().set(SKIP_ERROR_TOAST, true);

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
      this.skip,
    );
  }

  getUserById(userId: string): Observable<User> {
    return this.api.get<User>(`${this.basePath}/GetUserById/${userId}`, undefined, this.skip);
  }

  adminUpdateUser(userId: string, data: AdminUpdateRequest): Observable<null> {
    return this.api.put<null>(`${this.basePath}/AdminUpdate/${userId}`, data, this.skip);
  }

  updateProfile(userId: string, data: UpdateProfileRequest): Observable<null> {
    return this.api.put<null>(`${this.basePath}/UpdateProfile/${userId}`, data, this.skip);
  }

  deleteUser(userId: string): Observable<string> {
    return this.api.delete<string>(`${this.basePath}/${userId}`, this.skip);
  }

  addUser(user: CreateUserRequest): Observable<User> {
    return this.api.post<User>(`${this.basePath}`, user, this.skip);
  }
}
