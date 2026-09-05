import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourierActivityService {
  private readonly activeCount$ = new BehaviorSubject<number>(0);
  readonly count$ = this.activeCount$.asObservable();

  setCount(count: number): void {
    this.activeCount$.next(count);
  }
}
