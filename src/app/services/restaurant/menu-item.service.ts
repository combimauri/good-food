import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ImenuItem } from '../../interfaces/imenu-item';
import { ImenuItemId } from '../../interfaces/imenu-item-id';

@Injectable()
export class MenuItemService {

  private menuItemsCollection: AngularFirestoreCollection<ImenuItem>;

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private subscriptions: SubscriptionsService) { }

  getMenuItemsByRestaurantId(restaurantId: string): Observable<ImenuItemId[]> {
    this.menuItemsCollection = this.afs.collection<ImenuItem>('menu-items', ref => ref.where('restaurantId', '==', restaurantId));

    return this.menuItemsCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ImenuItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  saveRestaurant(menuItem: ImenuItemId): Observable<any> {
    const newMenuItem: ImenuItem = {
      name: menuItem.name,
      price: menuItem.price,
      addUserId: menuItem.addUserId,
      restaurantId: menuItem.restaurantId,
      hasPicture: menuItem.hasPicture
    };

    return Observable.fromPromise(this.menuItemsCollection.add(newMenuItem)).takeUntil(this.subscriptions.unsubscribe);
  }

}
