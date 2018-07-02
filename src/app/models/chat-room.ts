import { IchatRoomId } from '../interfaces/ichat-room-id';
import { IappUser } from '../interfaces/iapp-user';

export class ChatRoom implements IchatRoomId {
    id: string;
    restaurantId: string;
    userId: string;
    lastMessage: string;
    date: Date;
    contactUser?: IappUser;
}
