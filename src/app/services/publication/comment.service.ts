import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Icomment } from '../../interfaces/icomment';

@Injectable()
export class CommentService {
    private commentsCollection: AngularFirestoreCollection<Icomment>;

    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {}

    getCommentsByPostId(postId: string): Observable<Icomment[]> {
        this.commentsCollection = this.afs.collection<Icomment>(
            'comments',
            ref => ref.where('postId', '==', postId).orderBy('date', 'asc')
        );

        return this.commentsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Icomment;
                    const commentDate: any = data.date;
                    data.date = new Date(commentDate.seconds * 1000);
                    return data;
                });
            });
    }

    saveComment(comment: Icomment) {
        let newComment: Icomment = {
            comment: comment.comment,
            ownerId: comment.ownerId,
            isOwnerARestaurant: comment.isOwnerARestaurant,
            postId: comment.postId,
            date: new Date()
        };

        return Observable.fromPromise(
            this.commentsCollection.add(newComment)
        ).takeUntil(this.subscriptions.destroyUnsubscribe);
    }
}
