import { TestBed, inject } from '@angular/core/testing';

import { MenuItemCategoryService } from './menu-item-category.service';

describe('MenuItemCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuItemCategoryService]
    });
  });

  it('should be created', inject([MenuItemCategoryService], (service: MenuItemCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
