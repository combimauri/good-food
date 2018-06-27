import { TestBed, inject } from '@angular/core/testing';

import { AppUserService } from './app-user.service';

describe('AppUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppUserService]
    });
  });

  it('should be created', inject([AppUserService], (service: AppUserService) => {
    expect(service).toBeTruthy();
  }));
});
