import { TestBed, inject } from '@angular/core/testing';

import { ChatRoomService } from './chat-room.service';

describe('ChatRoomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatRoomService]
    });
  });

  it('should be created', inject([ChatRoomService], (service: ChatRoomService) => {
    expect(service).toBeTruthy();
  }));
});
