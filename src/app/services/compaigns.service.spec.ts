import { TestBed } from '@angular/core/testing';

import { CompaignsService } from './compaigns.service';

describe('CompaignsService', () => {
  let service: CompaignsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaignsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
