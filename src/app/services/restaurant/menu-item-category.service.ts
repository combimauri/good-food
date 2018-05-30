import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { ImenuItemCategory } from '../../interfaces/imenu-item-category';
import { ImenuItemCategoryId } from '../../interfaces/imenu-item-category-id';

@Injectable()
export class MenuItemCategoryService {

  private menuItemCategoriesCollection: AngularFirestoreCollection<ImenuItemCategory>;

  constructor(private afs: AngularFirestore,
    private subscriptions: SubscriptionsService) { }

  getMenuItemCategoriesByRestaurantId(restaurantId: string): Observable<ImenuItemCategoryId[]> {
    this.menuItemCategoriesCollection = this.afs.collection<ImenuItemCategory>('menu-item-categories', ref => ref.where('restaurantId', '==', restaurantId));

    return this.menuItemCategoriesCollection.snapshotChanges().takeUntil(this.subscriptions.unsubscribe).map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as ImenuItemCategory;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  saveMenuItemCategory(name: string, restaurantId: string): Observable<any> {
    const category: ImenuItemCategory = {
      name: name,
      restaurantId: restaurantId
    }

    return Observable.fromPromise(this.menuItemCategoriesCollection.add(category)).takeUntil(this.subscriptions.unsubscribe);
  }

}
