import { Injectable } from '@angular/core';
import { ApiService } from '../../../Core/services/api.service';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/dashboard-stats.model';
import { HttpContext, HttpParams } from '@angular/common/http';
import { SKIP_ERROR_TOAST } from '../../../shared/tokens/skip-error-toast.token';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly basePath = '/Dashboard';
  private readonly skip = new HttpContext().set(SKIP_ERROR_TOAST, true);

  constructor(private readonly api: ApiService) {}

  getStats(trendDays: number = 7): Observable<DashboardStats> {
    const params = new HttpParams().set('trendDays', trendDays.toString());
    return this.api.get<DashboardStats>(
      `${this.basePath}/stats`,
      params,
      this.skip,
    );
  }
}
