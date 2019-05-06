import { TestBed, inject } from '@angular/core/testing';

import { Auth1Service } from './auth1.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth1Service]
    });
  });

  it('should be created', inject([Auth1Service], (service: Auth1Service) => {
    expect(service).toBeTruthy();
  }));
});
