import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { IfollowRelationship } from '../../interfaces/ifollow-relationship';
import { IfollowRelationshipId } from '../../interfaces/ifollow-relationship-id';

@Injectable()
export class FollowRelationshipService {
    private followRelationshipsCollection: AngularFirestoreCollection<
        IfollowRelationship
    >;

    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {}

    getRestaurantFollowersCount(restaurantId: string): Observable<number> {
        return this.getRelationshipsByRestaurantId(restaurantId).map(
            relationships => {
                return relationships.length;
            },
            () => {
                return 0;
            }
        ).takeUntil(this.subscriptions.destroyUnsubscribe);
    }

    getRelationshipsByRestaurantId(
        restaurantId: string
    ): Observable<IfollowRelationshipId[]> {
        this.followRelationshipsCollection = this.afs.collection<
            IfollowRelationship
        >('follow-relationships', ref =>
            ref.where('restaurantId', '==', restaurantId)
        );

        return this.followRelationshipsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as IfollowRelationship;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    getRelationshipsByUserId(
        userId: string
    ): Observable<IfollowRelationshipId[]> {
        this.followRelationshipsCollection = this.afs.collection<
            IfollowRelationship
        >('follow-relationships', ref => ref.where('userId', '==', userId));

        return this.followRelationshipsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as IfollowRelationship;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    getRelationshipsByRestaurantAndUserId(
        restaurantId: string,
        userId: string
    ): Observable<IfollowRelationshipId[]> {
        this.followRelationshipsCollection = this.afs.collection<
            IfollowRelationship
        >('follow-relationships', ref =>
            ref
                .where('restaurantId', '==', restaurantId)
                .where('userId', '==', userId)
        );

        return this.followRelationshipsCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.destroyUnsubscribe)
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as IfollowRelationship;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    saveRelationship(relationship: IfollowRelationship): Observable<any> {
        const id: string = `${relationship.restaurantId}_${
            relationship.userId
        }`;

        return Observable.fromPromise(
            this.followRelationshipsCollection.doc(id).set(relationship)
        ).takeUntil(this.subscriptions.destroyUnsubscribe);
    }

    deleteRelationship(restaurantId: string, userId: string): Observable<any> {
        const id: string = `${restaurantId}_${userId}`;

        return Observable.fromPromise(
            this.followRelationshipsCollection.doc(id).delete()
        );
    }
}
