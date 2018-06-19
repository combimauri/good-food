import { Ichat } from "../interfaces/ichat";

export class ChatMessage implements Ichat {
    message: string;
    chatRoomId: string;
}
