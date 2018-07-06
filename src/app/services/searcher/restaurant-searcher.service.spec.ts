import { TestBed, inject } from '@angular/core/testing';

import { RestaurantSearcherService } from './restaurant-searcher.service';

describe('RestaurantSearcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestaurantSearcherService]
    });
  });

  it('should be created', inject([RestaurantSearcherService], (service: RestaurantSearcherService) => {
    expect(service).toBeTruthy();
  }));
});
