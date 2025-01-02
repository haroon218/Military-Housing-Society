import { TestBed } from '@angular/core/testing';

import { RewardOfferService } from './reward-offer.service';

describe('RewardOfferService', () => {
  let service: RewardOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
