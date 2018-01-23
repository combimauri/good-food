import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { Irestaurant } from '../../interfaces/irestaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

@Injectable()
export class RestaurantService {

  restaurants: Observable<IrestaurantId[]>;

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

  saveRestaurant(newRestaurant: IrestaurantId, restaurantProfilePic: File): void {
    const name: string = newRestaurant.name;
    const type: string = newRestaurant.type;
    const category: string = newRestaurant.category;
    const lat: number = newRestaurant.lat;
    const lng: number = newRestaurant.lng;
    const restaurant: Irestaurant = { name, type, category, lat, lng };


    this.restaurantsCollection.add(restaurant).then(
      (data) => {
        let restaurantId = data.id;
        const storageRef = this.fa.storage().ref();
        const restaurantProfilePicsRef = storageRef.child(`images/restaurant-profile/${restaurantId}.jpg`);
        let metadata = {
          name: `${restaurantId}`,
          contentType: 'image/jpeg',
        };
        restaurantProfilePicsRef.put(restaurantProfilePic).then(
          () => {
            console.log('File uploaded successfully');
          }
        );
      }
    );
  }

}
