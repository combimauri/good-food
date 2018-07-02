import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { ChatService } from '../../services/chat/chat.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Ichat } from '../../interfaces/ichat';
import { ChatMessage } from '../../models/chat-message';
import { ChatRoom } from '../../models/chat-room';
import { IappUser } from '../../interfaces/iapp-user';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnChanges {
    @Input() chatRoom: ChatRoom;

    @Output() onDeleteCurrentContact = new EventEmitter();

    noPhotoURL: string;

    messages: Ichat[];

    newMessage: Ichat;

    private isCurrentAppUserARestaurant: boolean;

    private currentUser: IappUser;

    constructor(
        private chatService: ChatService,
        private chatRoomService: ChatRoomService,
        private authService: AuthenticationService,
        private router: Router
    ) {
        this.noPhotoURL = noPhotoURL;
        this.messages = [];
        this.newMessage = new ChatMessage();
        this.isCurrentAppUserARestaurant = false;
        this.currentUser = this.authService.buildAppUser('', '', noPhotoURL);

        this.authService.isAppUserARestaurant().subscribe(isRestaurant => {
            this.isCurrentAppUserARestaurant = isRestaurant;
        });
        this.authService.getCurrentAppUser().subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnChanges(): void {
        if (this.chatRoom.id) {
            this.setChatRoomMessages();
        }
    }

    sendMessage(): void {
        if (this.newMessage.message) {
            this.newMessage.chatRoomId = this.chatRoom.id;
            this.newMessage.senderId = this.currentUser.id;
            this.chatService.saveChat(this.newMessage);

            this.newMessage = new ChatMessage();
        }
    }

    goToUserProfile(): void {
        if (!this.isCurrentAppUserARestaurant) {
            this.router.navigate([
                '/restaurant-profile',
                this.chatRoom.restaurantId
            ]);
        }
    }

    private setChatRoomMessages(): void {
        this.messages = [];
        this.chatService
            .getChatsByChatRoomId(this.chatRoom.id)
            .subscribe(messages => {
                this.messages = messages;
            });

        this.chatService
            .getLastChatByChatRoomId(this.chatRoom.id)
            .subscribe(message => {
                if (message) {
                    this.chatRoom.lastMessage = message.message;
                    this.chatRoom.date = message.date;
                    this.chatRoomService.updateChatRoom({
                        id: this.chatRoom.id,
                        restaurantId: this.chatRoom.restaurantId,
                        userId: this.chatRoom.userId,
                        date: this.chatRoom.date,
                        lastMessage: this.chatRoom.lastMessage
                    });
                }
            });
    }
}
