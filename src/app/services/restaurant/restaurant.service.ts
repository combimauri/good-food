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
    const name: string = restaurant.name;
    const type: string = restaurant.type;
    const categoryId: string = restaurant.categoryId;
    const lat: number = restaurant.lat;
    const lng: number = restaurant.lng;
    const hasProfilePic: boolean = restaurant.hasProfilePic;
    const addUserId: string = restaurant.addUserId;
    const newRestaurant: Irestaurant = {
      name,
      type,
      categoryId,
      lat,
      lng,
      hasProfilePic,
      addUserId
    };

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

}
