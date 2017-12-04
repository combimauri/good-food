import { TestBed, inject } from '@angular/core/testing';

import { LogInGuardService } from './log-in-guard.service';

describe('LogInGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogInGuardService]
    });
  });

  it('should be created', inject([LogInGuardService], (service: LogInGuardService) => {
    expect(service).toBeTruthy();
  }));
});
