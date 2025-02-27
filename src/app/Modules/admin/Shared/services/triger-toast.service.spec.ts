import { TestBed } from '@angular/core/testing';

import { TrigerToastService } from './triger-toast.service';

describe('TrigerToastService', () => {
  let service: TrigerToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrigerToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
