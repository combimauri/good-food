import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { IchatRoom } from '../../interfaces/ichat-room';
import { IchatRoomId } from '../../interfaces/ichat-room-id';

@Injectable()
export class ChatRoomService {
    selectedChatUserId: string;

    private chatRoomsCollection: AngularFirestoreCollection<IchatRoom>;

    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {
        this.selectedChatUserId = '';
    }

    getChatRoomsByRestaurantId(
        restaurantId: string
    ): Observable<IchatRoomId[]> {
        this.chatRoomsCollection = this.afs.collection<IchatRoom>(
            'chat-rooms',
            ref => ref.where('restaurantId', '==', restaurantId)
        );

        return this.chatRoomsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as IchatRoom;
                    const id = a.payload.doc.id;
                    const lastMessageDate: any = data.date;
                    data.date = new Date(lastMessageDate.seconds * 1000);

                    return { id, ...data };
                });
            });
    }

    getChatRoomsByUserId(userId: string): Observable<IchatRoomId[]> {
        this.chatRoomsCollection = this.afs.collection<IchatRoom>(
            'chat-rooms',
            ref => ref.where('userId', '==', userId).orderBy('date', 'desc')
        );

        return this.chatRoomsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as IchatRoom;
                    const id = a.payload.doc.id;
                    const lastMessageDate: any = data.date;
                    data.date = new Date(lastMessageDate.seconds * 1000);

                    return { id, ...data };
                });
            });
    }

    saveChatRoom(chatRoom: IchatRoom): Observable<any> {
        let roomsCol: AngularFirestoreCollection<
            IchatRoom
        > = this.afs.collection<IchatRoom>('chat-rooms');
        const id: string = `${chatRoom.restaurantId}_${chatRoom.userId}`;

        return Observable.fromPromise(
            roomsCol.doc(id).set(chatRoom, { merge: true })
        ).takeUntil(this.subscriptions.destroyUnsubscribe);
    }

    updateChatRoom(chatRoom: IchatRoomId): Observable<any> {
        return Observable.fromPromise(
            this.chatRoomsCollection
                .doc(chatRoom.id)
                .set(chatRoom, { merge: true })
        ).takeUntil(this.subscriptions.destroyUnsubscribe);
    }
}
