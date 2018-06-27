import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Ichat } from '../../interfaces/ichat';

@Injectable()
export class ChatService {
    private chatsCollection: AngularFirestoreCollection<Ichat>;

    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {}

    getChatsByChatRoomId(chatRoomId: string): Observable<Ichat[]> {
        this.chatsCollection = this.afs.collection<Ichat>('chats', ref =>
            ref.where('chatRoomId', '==', chatRoomId).orderBy('date', 'asc')
        );

        return this.chatsCollection
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Ichat;
                    const lastMessageDate: any = data.date;
                    data.date = new Date(lastMessageDate.seconds * 1000);

                    return data;
                });
            })
            .takeUntil(this.subscriptions.unsubscribe);
    }

    getLastChatByChatRoomId(chatRoomId: string): Observable<Ichat> {
        return this.afs
            .collection<Ichat>('chats', ref =>
                ref
                    .where('chatRoomId', '==', chatRoomId)
                    .orderBy('date', 'desc')
                    .limit(1)
            )
            .valueChanges()
            .map(chats => {
                const chat = chats[0];
                if (chat) {
                    const lastMessageDate: any = chat.date;
                    chat.date = new Date(lastMessageDate.seconds * 1000);
                }

                return chat;
            })
            .takeUntil(this.subscriptions.unsubscribe);
    }

    saveChat(chat: Ichat) {
        const chatMessage: Ichat = {
            message: chat.message,
            chatRoomId: chat.chatRoomId,
            date: new Date()
        };

        return Observable.fromPromise(
            this.chatsCollection.add(chatMessage)
        ).takeUntil(this.subscriptions.unsubscribe);
    }
}
