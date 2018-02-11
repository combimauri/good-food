import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'firebase/storage';

import { Irestaurant } from '../../interfaces/irestaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

@Injectable()
export class RestaurantService {

  restaurants: Observable<IrestaurantId[]>;

  private restaurantDoc: AngularFirestoreDocument<Irestaurant>;

  private restaurantsCollection: AngularFirestoreCollection<Irestaurant>;

  constructor(private fa: FirebaseApp, private afs: AngularFirestore) {
    this.restaurantsCollection = this.afs.collection<Irestaurant>('restaurants');
    this.restaurants = this.restaurantsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Irestaurant;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  getRestaurant(id: string): Observable<Irestaurant> {
    this.restaurantDoc = this.afs.doc<Irestaurant>(`restaurants/${id}`);

    return this.restaurantDoc.valueChanges();
  }

  getRestaurantProfilePic(id: string): Observable<any> {
    const storageRef = this.fa.storage().ref();
    const restaurantProfilePicsRef = storageRef.child(`images/restaurant-profile/${id}.jpg`);

    return Observable.fromPromise(restaurantProfilePicsRef.getDownloadURL());
  }

  saveRestaurant(restaurant: IrestaurantId): Observable<any> {
    const newRestaurant: Irestaurant = this.buildRestaurantInterface(restaurant);

    return Observable.fromPromise(this.restaurantsCollection.add(newRestaurant));
  }

  saveRestaurantProfilePic(id: string, profilePic: File): Observable<any> {
    const storageRef = this.fa.storage().ref();
    const restaurantProfilePicsRef = storageRef.child(`images/restaurant-profile/${id}.jpg`);
    let metadata = {
      name: `${id}`,
      contentType: 'image/jpeg',
    };

    return Observable.fromPromise(restaurantProfilePicsRef.put(profilePic));
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
