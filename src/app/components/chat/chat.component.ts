import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { ChatService } from '../../services/chat/chat.service';
import { Ichat } from '../../interfaces/ichat';

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

  constructor(private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptions: SubscriptionsService) {

    this.noPhotoURL = noPhotoURL;
    this.messages = [];
  }

  ngOnInit() {
    this.route.params.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (params) => {
        this.chatRoomId = params['id'];
        let backSlashIndex: number = this.chatRoomId.indexOf('_');

        this.restaurantId = this.chatRoomId.substring(0, backSlashIndex);
        this.userId = this.chatRoomId.substring(backSlashIndex + 1, this.chatRoomId.length);

        console.log(this.restaurantId);
        console.log(this.userId);
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
