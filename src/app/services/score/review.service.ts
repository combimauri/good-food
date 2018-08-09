import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { IreviewId } from '../../interfaces/ireview-id';
import { Ireview } from '../../interfaces/ireview';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Review } from '../../models/review';

@Injectable()
export class ReviewService {
    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {}

    getRestarantAverageRating(restaurantId: string): Observable<Review> {
        return this.getRestaurantReviews(restaurantId).map(reviews => {
            let foodRatingSum: number = 0;
            let attentionRatingSum: number = 0;
            let environmentRatingSum: number = 0;
            let reviewsCount: number = reviews.length;
            let review: Review = new Review();

            reviews.forEach(review => {
                foodRatingSum += review.foodRating;
                attentionRatingSum += review.attentionRating;
                environmentRatingSum += review.environmentRating;
            });

            review.restaurantId = restaurantId;
            review.foodRating = reviewsCount ? foodRatingSum / reviewsCount : 0;
            review.attentionRating = reviewsCount
                ? attentionRatingSum / reviewsCount
                : 0;
            review.environmentRating = reviewsCount
                ? environmentRatingSum / reviewsCount
                : 0;
            return review;
        });
    }

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
                    const date: any = data.date;
                    data.date = new Date(date.seconds * 1000);
                    return { id, ...data };
                });
            })
            .takeUntil(this.subscriptions.destroyUnsubscribe);
    }

    getRestaurantReview(
        restaurantId: string,
        userId: string
    ): Observable<Ireview> {
        const reviewDoc = this.afs.doc<Ireview>(
            `restaurant-reviews/${restaurantId}_${userId}`
        );

        return reviewDoc
            .valueChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe);
    }

    saveRestaurantReview(review: Ireview): Observable<void> {
        const id: string = `${review.restaurantId}_${review.userId}`;
        const newReview: Ireview = {
            ...review,
            date: new Date()
        };

        return Observable.fromPromise(
            this.afs
                .collection('restaurant-reviews')
                .doc(id)
                .set(newReview, { merge: true })
        );
    }
}
