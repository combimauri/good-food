import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { ChatService } from '../../services/chat/chat.service';
import { Ichat } from '../../interfaces/ichat';
import { ChatMessage } from '../../models/chat-message';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  noPhotoURL: string;

  chatRoomId: string;

  restaurantId: string;

  userId: string;

  messages: Ichat[];

  newMessage: Ichat;

  constructor(private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.noPhotoURL = noPhotoURL;
    this.messages = [];
    this.newMessage = new ChatMessage();
  }

  ngOnInit() {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        this.chatRoomId = params['id'];
        let backSlashIndex: number = this.chatRoomId.indexOf('_');

        this.restaurantId = this.chatRoomId.substring(0, backSlashIndex);
        this.userId = this.chatRoomId.substring(backSlashIndex + 1, this.chatRoomId.length);

        this.setChatRoomMessages();
      }
    );
  }

  private setChatRoomMessages(): void {
    this.chatService.getChatsByChatRoomId(this.chatRoomId).subscribe(
      messages => {
        this.messages = messages;
      },
      error => {
        console.error(error);
      }
    );
  }

}
