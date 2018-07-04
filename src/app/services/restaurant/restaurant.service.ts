import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreDocument,
    AngularFirestoreCollection
} from 'angularfire2/firestore';
import {
    AngularFireStorage,
    AngularFireUploadTask
} from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { Subject } from 'rxjs/Subject';

export interface RestaurantPhotoURLMap {
    restaurantId: string;
    photoURL: string;
}

@Injectable()
export class RestaurantService {
    restaurants: Observable<IrestaurantId[]>;

    restaurantPhotoObservable: Observable<RestaurantPhotoURLMap>;

    restaurantPhotoSubject: Subject<RestaurantPhotoURLMap>;

    private restaurantDoc: AngularFirestoreDocument<Irestaurant>;

    private restaurantsCollection: AngularFirestoreCollection<Irestaurant>;

    constructor(
        private afs: AngularFirestore,
        private storage: AngularFireStorage,
        private subscriptions: SubscriptionsService
    ) {
        this.restaurantPhotoSubject = new Subject<RestaurantPhotoURLMap>();
        this.restaurantPhotoObservable = this.restaurantPhotoSubject.asObservable();
        this.restaurantsCollection = this.afs.collection<Irestaurant>(
            'restaurants'
        );
        this.restaurants = this.restaurantsCollection
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Irestaurant;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
            .takeUntil(this.subscriptions.unsubscribe);
    }

    getBusinessOwnerRestaurants(userId: string): Observable<IrestaurantId[]> {
        return this.afs
            .collection<Irestaurant>('restaurants', ref =>
                ref.where('ownerId', '==', userId)
            )
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Irestaurant;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                });
            })
            .takeUntil(this.subscriptions.unsubscribe);
    }

    getRestaurant(id: string): Observable<Irestaurant> {
        this.restaurantDoc = this.afs.doc<Irestaurant>(`restaurants/${id}`);

        return this.restaurantDoc
            .valueChanges()
            .takeUntil(this.subscriptions.unsubscribe);
    }

    getRestaurantProfilePic(id: string): Observable<any> {
        const restaurantProfilePicsRef = this.storage.ref(
            `images/restaurants/restaurant-${id}/${id}.jpg`
        );

        return restaurantProfilePicsRef
            .getDownloadURL()
            .takeUntil(this.subscriptions.unsubscribe);
    }

    saveRestaurant(restaurant: IrestaurantId): Observable<any> {
        const newRestaurant: Irestaurant = this.buildRestaurantInterface(
            restaurant
        );

        return Observable.fromPromise(
            this.restaurantsCollection.add(newRestaurant)
        ).takeUntil(this.subscriptions.unsubscribe);
    }

    saveRestaurantProfilePic(
        id: string,
        profilePic: File
    ): AngularFireUploadTask {
        const filePath = `images/restaurants/restaurant-${id}/${id}.jpg`;

        return this.storage.upload(filePath, profilePic);
    }

    updateRestaurant(restaurant: IrestaurantId): Observable<any> {
        const newRestaurant: Irestaurant = this.buildRestaurantInterface(
            restaurant
        );

        return Observable.fromPromise(
            this.restaurantsCollection
                .doc(restaurant.id)
                .set(newRestaurant, { merge: true })
        ).takeUntil(this.subscriptions.unsubscribe);
    }

    buildRestaurantIdInterface(
        restaurantId: string,
        restaurant: Irestaurant
    ): IrestaurantId {
        return {
            id: restaurantId,
            ...restaurant
        } as IrestaurantId;
    }

    private buildRestaurantInterface(restaurant: IrestaurantId): Irestaurant {
        if (restaurant.ownerId) {
            return {
                name: restaurant.name,
                type: restaurant.type,
                categoryId: restaurant.categoryId,
                lat: restaurant.lat,
                lng: restaurant.lng,
                hasProfilePic: restaurant.hasProfilePic,
                addUserId: restaurant.addUserId,
                ownerId: restaurant.ownerId,
                followersCount: restaurant.followersCount
            } as Irestaurant;
        }
        return {
            name: restaurant.name,
            type: restaurant.type,
            categoryId: restaurant.categoryId,
            lat: restaurant.lat,
            lng: restaurant.lng,
            hasProfilePic: restaurant.hasProfilePic,
            addUserId: restaurant.addUserId,
            followersCount: restaurant.followersCount
        } as Irestaurant;
    }
}
