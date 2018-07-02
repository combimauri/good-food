import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ChatRoomService } from '../../services/chat/chat-room.service';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { UserService } from '../../services/user/user.service';
import { ChatRoom } from '../../models/chat-room';
import { IappUser } from '../../interfaces/iapp-user';
import { IchatRoomId } from '../../interfaces/ichat-room-id';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
    selector: 'food-chat-rooms',
    templateUrl: './chat-rooms.component.html',
    styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent {
    chatRooms: ChatRoom[];

    currentChatRoom: ChatRoom;

    private isCurrentUserARestaurant: boolean;

    private currentUser: IappUser;

    constructor(
        private authService: AuthenticationService,
        private restaurantService: RestaurantService,
        private userService: UserService,
        private chatRoomService: ChatRoomService
    ) {
        this.chatRooms = [];
        this.currentChatRoom = new ChatRoom();
        this.isCurrentUserARestaurant = false;
        this.currentUser = this.authService.buildAppUser('', '', noPhotoURL);

        this.authService.getCurrentAppUser().subscribe(user => {
            this.currentUser = user;
            this.authService.isAppUserARestaurant().subscribe(isRestaurant => {
                this.isCurrentUserARestaurant = isRestaurant;
                this.setChatRooms();
            });
        });
    }

    setCurrentChatRoom(chatRoom: ChatRoom): void {
        this.chatRoomService.selectedChatUserId = chatRoom.contactUser.id;
        this.currentChatRoom = chatRoom;
    }

    deleteCurrentContact(): void {
        this.chatRoomService.selectedChatUserId = '';
        this.currentChatRoom = new ChatRoom();
    }

    private setChatRooms(): void {
        if (!this.isCurrentUserARestaurant) {
            this.setUserChatRooms();
        } else {
            this.setRestaurantChatRooms();
        }
    }

    private setUserChatRooms(): void {
        this.chatRoomService
            .getChatRoomsByUserId(this.currentUser.id)
            .subscribe(chatRooms => {
                if (chatRooms.length !== this.chatRooms.length) {
                    this.chatRooms = chatRooms;
                    this.setRestaurantsUserData();
                } else {
                    this.setChatRoomsIfChanged(chatRooms);
                }
                let selectedChatRoom: ChatRoom = this.chatRooms.find(
                    chatRoom => {
                        return (
                            chatRoom.restaurantId ===
                            this.chatRoomService.selectedChatUserId
                        );
                    }
                );
                if (selectedChatRoom) {
                    this.setCurrentChatRoom(selectedChatRoom);
                }
            });
    }

    private setRestaurantsUserData(): void {
        this.chatRooms.forEach(chatRoom => {
            chatRoom.contactUser = this.authService.buildAppUser(
                chatRoom.restaurantId,
                '',
                noPhotoURL
            );
            this.restaurantService
                .getRestaurant(chatRoom.restaurantId)
                .subscribe(restaurant => {
                    chatRoom.contactUser.name = restaurant.name;
                    if (restaurant.hasProfilePic) {
                        this.setRestaurantPhotoURL(chatRoom.contactUser);
                    }
                });
        });
    }

    private setRestaurantPhotoURL(restaurantUser: IappUser): void {
        this.restaurantService
            .getRestaurantProfilePic(restaurantUser.id)
            .subscribe(url => {
                restaurantUser.photoURL = url;
            });
    }

    private setRestaurantChatRooms(): void {
        this.chatRoomService
            .getChatRoomsByRestaurantId(this.currentUser.id)
            .subscribe(chatRooms => {
                if (chatRooms.length !== this.chatRooms.length) {
                    this.chatRooms = chatRooms;
                    this.setNormalUserData();
                } else {
                    this.setChatRoomsIfChanged(chatRooms);
                }
                let selectedChatRoom: ChatRoom = this.chatRooms.find(
                    chatRoom => {
                        return (
                            chatRoom.userId ===
                            this.chatRoomService.selectedChatUserId
                        );
                    }
                );
                if (selectedChatRoom) {
                    this.setCurrentChatRoom(selectedChatRoom);
                }
            });
    }

    private setNormalUserData(): void {
        this.chatRooms.forEach(chatRoom => {
            chatRoom.contactUser = this.authService.buildAppUser(
                chatRoom.userId,
                '',
                noPhotoURL
            );
            this.userService.getUser(chatRoom.userId).subscribe(user => {
                chatRoom.contactUser.name = user.name;
                chatRoom.contactUser.photoURL = user.photoURL;
            });
        });
    }

    private setChatRoomsIfChanged(chatRooms: IchatRoomId[]): void {
        let firstChatRoomId: string = chatRooms[0].id;
        let chatRoom: ChatRoom = this.chatRooms.find(room => {
            return room.id === firstChatRoomId;
        });
        let chatRoomIndex: number = this.chatRooms.findIndex(room => {
            return room.id === firstChatRoomId;
        });
        this.chatRooms.splice(chatRoomIndex, 1);
        this.chatRooms.unshift(chatRoom);
    }
}
