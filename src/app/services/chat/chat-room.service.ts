import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { IchatRoom } from '../../interfaces/ichat-room';
import { IchatRoomId } from '../../interfaces/ichat-room-id';

@Injectable()
export class ChatRoomService {

  private chatRoomsCollection: AngularFirestoreCollection<IchatRoom>;

  constructor(private afs: AngularFirestore, private subscriptions: SubscriptionsService) { }

  getChatRoomByRestaurantId(restaurantId: string): Observable<IchatRoomId[]> {
    this.chatRoomsCollection = this.afs.collection<IchatRoom>('chat-rooms', ref => ref.where('restaurantId', '==', restaurantId));

    return this.chatRoomsCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IchatRoom;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getChatRoomByUserId(userId: string): Observable<IchatRoomId[]> {
    this.chatRoomsCollection = this.afs.collection<IchatRoom>('chat-rooms', ref => ref.where('userId', '==', userId));

    return this.chatRoomsCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as IchatRoom;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  saveChatRoom(chatRoom: IchatRoom): Observable<any> {
    return Observable.fromPromise(this.chatRoomsCollection.add(chatRoom)).takeUntil(this.subscriptions.unsubscribe);
  }

}
