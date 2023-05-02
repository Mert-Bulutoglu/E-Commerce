import { TestBed } from '@angular/core/testing';

import { AllOrderService } from './all-order.service';

describe('AllOrderService', () => {
  let service: AllOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
