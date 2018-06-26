import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { ChatService } from '../../services/chat/chat.service';
import { Ichat } from '../../interfaces/ichat';
import { ChatMessage } from '../../models/chat-message';
import { ChatRoom } from '../../models/chat-room';
import { ChatRoomService } from '../../services/chat/chat-room.service';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnChanges {
    @Input() chatRoom: ChatRoom;

    chatName: string;

    noPhotoURL: string;

    messages: Ichat[];

    newMessage: Ichat;

    // @ViewChild('chatContainerElement') private chatContainerElement: ElementRef;

    constructor(
        private chatService: ChatService,
        private chatRoomService: ChatRoomService,
        private route: ActivatedRoute,
        private router: Router,
        private subscriptions: SubscriptionsService
    ) {
        this.chatName = '';
        this.noPhotoURL = noPhotoURL;
        this.messages = [];
        this.newMessage = new ChatMessage();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.chatRoom.id) {
            this.chatName = this.chatRoom.restaurant.name;
            this.setChatRoomMessages();
        }
    }

    sendMessage(): void {
        if (this.newMessage.message) {
            this.newMessage.chatRoomId = this.chatRoom.id;
            this.chatService.saveChat(this.newMessage);

            this.newMessage = new ChatMessage();
        }
    }

    private setChatRoomMessages(): void {
        this.chatService.getChatsByChatRoomId(this.chatRoom.id).subscribe(
            messages => {
                this.messages = messages;
                // this.scrollToBottom();
            },
            error => {
                console.error(error);
            }
        );

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

    // private scrollToBottom(): void {
    //     let isScrolledToBottom =
    //         this.chatContainerElement.nativeElement.scrollHeight -
    //             this.chatContainerElement.nativeElement.clientHeight <=
    //         this.chatContainerElement.nativeElement.scrollTop + 1;
    //     if (isScrolledToBottom) {
    //         this.chatContainerElement.nativeElement.scrollTop =
    //             this.chatContainerElement.nativeElement.scrollHeight -
    //             this.chatContainerElement.nativeElement.clientHeight;
    //     }
    // }
}
