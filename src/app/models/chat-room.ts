import { Irestaurant } from '../interfaces/irestaurant';
import { Iuser } from '../interfaces/iuser';
import { IchatRoomId } from '../interfaces/ichat-room-id';

export class ChatRoom implements IchatRoomId {
    id: string;
    restaurantId: string;
    userId: string;
    restaurant?: Irestaurant;
    user?: Iuser;
    lastMessage: string;
    date: Date;
}
