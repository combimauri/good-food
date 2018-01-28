import { TestBed, inject } from '@angular/core/testing';

import { RestaurantCategoryService } from './restaurant-category.service';

describe('RestaurantCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestaurantCategoryService]
    });
  });

  it('should be created', inject([RestaurantCategoryService], (service: RestaurantCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
