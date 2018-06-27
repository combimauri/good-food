import { Component } from '@angular/core';

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { IuserId } from '../../interfaces/iuser-id';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { ChatRoom } from '../../models/chat-room';
import { Restaurant } from '../../models/restaurant';
import { BusinessOwnerChatRoom } from '../../models/business-owner-chat-room';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';

@Component({
    selector: 'food-chat-rooms',
    templateUrl: './chat-rooms.component.html',
    styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent {
    currentUser: IuserId;

    businessOwnerRestaurants: BusinessOwnerChatRoom[];

    restaurantChatRooms: ChatRoom[];

    userChatRooms: ChatRoom[];

    currentChatRoom: ChatRoom;

    constructor(
        private authService: AuthenticationService,
        private restaurantService: RestaurantService,
        private userService: UserService,
        private chatRoomService: ChatRoomService,
        private subscriptions: SubscriptionsService
    ) {
        this.businessOwnerRestaurants = [];
        this.userChatRooms = [];
        this.restaurantChatRooms = [];
        this.currentChatRoom = new ChatRoom();

        this.authService.authUser
            .takeUntil(this.subscriptions.unsubscribe)
            .subscribe(user => {
                this.currentUser = user;
                this.getUserChatRooms();
            });
    }

    setCurrentChatRoom(chatRoom: ChatRoom): void {
        this.currentChatRoom = chatRoom;
    }

    private getUserChatRooms(): void {
        this.chatRoomService
            .getChatRoomsByUserId(this.currentUser.id)
            .subscribe(chatRooms => {
                this.userChatRooms = chatRooms;
                this.getRoomRestaurants();
            });

        if (this.currentUser.roles['businessOwner']) {
            this.restaurantService
                .getBusinessOwnerRestaurants(this.currentUser.id)
                .subscribe(restaurants => {
                    restaurants.forEach(restaurant => {
                        this.chatRoomService
                            .getChatRoomsByRestaurantId(restaurant.id)
                            .subscribe(chatRooms => {
                                let userChat: BusinessOwnerChatRoom = new BusinessOwnerChatRoom(
                                    restaurant,
                                    chatRooms
                                );

                                this.getRoomUsers(userChat);
                                this.businessOwnerRestaurants.push(userChat);
                            });
                    });
                });
        }
    }

    private getRoomRestaurants(): void {
        this.userChatRooms.forEach(chatRoom => {
            chatRoom.restaurant = new Restaurant();
            chatRoom.user = this.currentUser;
            this.restaurantService
                .getRestaurant(chatRoom.restaurantId)
                .subscribe(restaurant => {
                    chatRoom.restaurant = restaurant;
                });
        });
    }

    private getRoomUsers(userChat: BusinessOwnerChatRoom): void {
        userChat.chatRooms.forEach(chatRoom => {
            chatRoom.restaurant = userChat.restaurant;
            chatRoom.user = new User();
            this.userService.getUser(chatRoom.userId).subscribe(user => {
                chatRoom.user = user;
            });
        });
    }
}
