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
    this.chatsCollection = this.afs.collection<Ichat>('chats', ref => ref.where('chatRoomId', '==', chatRoomId).orderBy('date', 'asc'));

    return this.chatsCollection.valueChanges().takeUntil(this.subscriptions.unsubscribe);
  }

  saveChat(chat: Ichat) {
    const chatMessage: Ichat = {
      message: chat.message,
      chatRoomId: chat.chatRoomId,
      date: new Date()
    };
    
    return Observable.fromPromise(this.chatsCollection.add(chatMessage)).takeUntil(this.subscriptions.unsubscribe);
  }

}
