import { IrestaurantId } from '../interfaces/irestaurant-id';
import { ChatRoom } from './chat-room';

export class BusinessOwnerChatRoom {
    restaurant: IrestaurantId;
    chatRooms: ChatRoom[];

    constructor(restaurant: IrestaurantId, chatRooms: ChatRoom[]) {
        this.restaurant = restaurant;
        this.chatRooms = chatRooms;
    }
}
