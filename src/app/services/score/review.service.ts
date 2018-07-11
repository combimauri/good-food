import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { IreviewId } from '../../ireview-id';
import { Ireview } from '../../ireview';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ReviewService {
    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {}

    getRestaurantReviews(restaurantId: string): Observable<IreviewId[]> {
        return this.afs
            .collection('restaurant-reviews', ref =>
                ref.where('restaurantId', '==', restaurantId)
            )
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Ireview;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
            .takeUntil(this.subscriptions.unsubscribe);
    }

    saveRestaurantReview(review: Ireview): Observable<void> {
        const id: string = `${review.restaurantId}_${review.userId}`;

        return Observable.fromPromise(
            this.afs
                .collection('restaurant-reviews')
                .doc(id)
                .set(review)
        );
    }
}
