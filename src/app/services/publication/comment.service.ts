import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Icomment } from '../../interfaces/icomment';

@Injectable()
export class CommentService {

  private commentsCollection: AngularFirestoreCollection<Icomment>;

  constructor(private afs: AngularFirestore,
    private subscriptions: SubscriptionsService) { }

  getCommentsByPostId(postId: string): Observable<Icomment[]> {
    this.commentsCollection = this.afs.collection<Icomment>('comments', ref => ref.where('postId', '==', postId).orderBy('date', 'asc'));

    return this.commentsCollection.valueChanges().takeUntil(this.subscriptions.unsubscribe);
  }

  saveComment(comment: Icomment) {
    let newComment: Icomment = {
      comment: comment.comment,
      ownerId: comment.ownerId,
      postId: comment.postId,
      date: new Date()
    };

    return Observable.fromPromise(this.commentsCollection.add(newComment)).takeUntil(this.subscriptions.unsubscribe);
  }

}
