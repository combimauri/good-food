import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Ichat } from '../../interfaces/ichat';

@Injectable()
export class ChatService {

  private chatsCollection: AngularFirestoreCollection<Ichat>;

  constructor(private afs: AngularFirestore, private subscriptions: SubscriptionsService) { }

  getChatsByChatRoomId(chatRoomId: string): Observable<Ichat[]> {
    this.chatsCollection = this.afs.collection<Ichat>('chats', ref => ref.where('chatRoomId', '==', chatRoomId));

    return this.chatsCollection.valueChanges().takeUntil(this.subscriptions.unsubscribe);
  }

  saveChat(chat: Ichat) {
    return Observable.fromPromise(this.chatsCollection.add(chat)).takeUntil(this.subscriptions.unsubscribe);
  }

}
