import { TestBed, inject } from '@angular/core/testing';

import { MapStyleService } from './map-style.service';

describe('MapStyleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapStyleService]
    });
  });

  it('should be created', inject([MapStyleService], (service: MapStyleService) => {
    expect(service).toBeTruthy();
  }));
});
