import { TestBed, async, inject } from '@angular/core/testing';

import { InternalGuard } from './internal.guard';

describe('InternalGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternalGuard]
    });
  });

  it('should ...', inject([InternalGuard], (guard: InternalGuard) => {
    expect(guard).toBeTruthy();
  }));
});
