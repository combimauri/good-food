import { TestBed, inject } from '@angular/core/testing';

import { FollowRelationshipService } from './follow-relationship.service';

describe('FollowRelationshipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowRelationshipService]
    });
  });

  it('should be created', inject([FollowRelationshipService], (service: FollowRelationshipService) => {
    expect(service).toBeTruthy();
  }));
});
