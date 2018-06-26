import { Component } from '@angular/core';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { IuserId } from '../../interfaces/iuser-id';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { ChatRoom } from '../../models/chat-room';
import { Restaurant } from '../../models/restaurant';

@Component({
    selector: 'food-chat-rooms',
    templateUrl: './chat-rooms.component.html',
    styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent {
    currentUser: IuserId;

    chatRooms: ChatRoom[];

    chatUsers: IuserId[];

    currentChatRoom: ChatRoom;

    constructor(
        private authService: AuthenticationService,
        private restaurantService: RestaurantService,
        private chatRoomService: ChatRoomService,
        private subscriptions: SubscriptionsService
    ) {
        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(user => {
                this.currentUser = user;
                this.getUserChatRooms();
            });

        this.chatRooms = [];
        this.currentChatRoom = new ChatRoom();
    }

    setCurrentChatRoom(chatRoom: ChatRoom): void {
        this.currentChatRoom = chatRoom;
    }

    private getUserChatRooms(): void {
        this.chatRoomService
            .getChatRoomByUserId(this.currentUser.id)
            .subscribe(chatRooms => {
                this.chatRooms = chatRooms;
                this.getRoomRestaurants();
            });
    }

    private getRoomRestaurants(): void {
        this.chatRooms.forEach(chatRoom => {
            chatRoom.restaurant = new Restaurant();
            chatRoom.user = this.currentUser;
            this.restaurantService
                .getRestaurant(chatRoom.restaurantId)
                .subscribe(restaurant => {
                    chatRoom.restaurant = restaurant;
                });
        });
    }
}
