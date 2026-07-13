import { Injectable } from '@angular/core';
import { ApiService } from '../Core/services/api.service';
import { UserProfile } from '../features/users/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private readonly api: ApiService) {}

  getUserProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/account/GetCurrentUser');
  }
}
