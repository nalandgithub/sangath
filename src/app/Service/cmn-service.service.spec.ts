import { TestBed } from '@angular/core/testing';

import { CmnServiceService } from './cmn-service.service';

describe('CmnServiceService', () => {
  let service: CmnServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmnServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
