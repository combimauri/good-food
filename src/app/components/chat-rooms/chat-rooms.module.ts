import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatRoomsRoutingModule } from './chat-rooms-routing.module';
import { ChatRoomsComponent } from './chat-rooms.component';
import { ChatComponent } from '../chat/chat.component';
import { ChatService } from '../../services/chat/chat.service';

@NgModule({
    imports: [CommonModule, FormsModule, ChatRoomsRoutingModule],
    declarations: [ChatRoomsComponent, ChatComponent],
    providers: [ChatService]
})
export class ChatRoomsModule {}
