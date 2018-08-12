import { TestBed, inject } from '@angular/core/testing';

import { InitialLoaderService } from './initial-loader.service';

describe('InitialLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitialLoaderService]
    });
  });

  it('should be created', inject([InitialLoaderService], (service: InitialLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
