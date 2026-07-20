import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly basePath = '/Dashboard';

  constructor(private readonly api: ApiService) {}

  getStats(trendDays: number = 7): Observable<DashboardStats>{
    const params = new HttpParams().set('trendDays', trendDays.toString());
    return this.api.get<DashboardStats>(`${this.basePath}/stats`, params)
  }
}
