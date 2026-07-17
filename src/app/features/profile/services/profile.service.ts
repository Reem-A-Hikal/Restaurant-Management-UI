import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../Core/services/api.service';
import { UserProfile } from '../../users/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private readonly api: ApiService) {}

  getUserProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/account/GetCurrentUser');
  }
}
