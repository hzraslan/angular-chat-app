import { TestBed, async, inject } from '@angular/core/testing';

import { DeportGuard } from './deport.guard';

describe('DeportGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeportGuard]
    });
  });

  it('should ...', inject([DeportGuard], (guard: DeportGuard) => {
    expect(guard).toBeTruthy();
  }));
});
