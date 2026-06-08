import { TestBed } from '@angular/core/testing';

import { ServicessService } from './servicess.service';

describe('ServicessService', () => {
  let service: ServicessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
