import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Irestaurant } from '../../interfaces/irestaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

@Injectable()
export class RestaurantService {

  restaurants: Observable<IrestaurantId[]>;

  private restaurantDoc: AngularFirestoreDocument<Irestaurant>;

  private restaurantsCollection: AngularFirestoreCollection<Irestaurant>;

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private subscriptions: SubscriptionsService) {

    this.restaurantsCollection = this.afs.collection<Irestaurant>('restaurants');
    this.restaurants = this.restaurantsCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Irestaurant;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getRestaurant(id: string): Observable<Irestaurant> {
    this.restaurantDoc = this.afs.doc<Irestaurant>(`restaurants/${id}`);

    return this.restaurantDoc.valueChanges().takeUntil(this.subscriptions.unsubscribe);
  }

  getRestaurantProfilePic(id: string): Observable<any> {
    const restaurantProfilePicsRef = this.storage.ref(`images/restaurants/restaurant-${id}/${id}.jpg`);

    return restaurantProfilePicsRef.getDownloadURL().takeUntil(this.subscriptions.unsubscribe);
  }

  saveRestaurant(restaurant: IrestaurantId): Observable<any> {
    const newRestaurant: Irestaurant = this.buildRestaurantInterface(restaurant);

    return Observable.fromPromise(this.restaurantsCollection.add(newRestaurant)).takeUntil(this.subscriptions.unsubscribe);
  }

  saveRestaurantProfilePic(id: string, profilePic: File): AngularFireUploadTask {
    let filePath = `images/restaurants/restaurant-${id}/${id}.jpg`;

    return this.storage.upload(filePath, profilePic);
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
        ownerId: restaurant.ownerId
      } as Irestaurant;
    }
    return {
      name: restaurant.name,
      type: restaurant.type,
      categoryId: restaurant.categoryId,
      lat: restaurant.lat,
      lng: restaurant.lng,
      hasProfilePic: restaurant.hasProfilePic,
      addUserId: restaurant.addUserId
    } as Irestaurant;
  }

}
