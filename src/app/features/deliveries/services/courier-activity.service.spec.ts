/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CourierActivityService } from './courier-activity.service';

describe('Service: CourierActivity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourierActivityService]
    });
  });

  it('should ...', inject([CourierActivityService], (service: CourierActivityService) => {
    expect(service).toBeTruthy();
  }));
});
