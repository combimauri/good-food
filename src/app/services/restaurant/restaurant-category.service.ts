import { Injectable } from '@angular/core';
import {
    AngularFirestoreCollection,
    AngularFirestore
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';

import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { Icategory } from '../../interfaces/icategory';
import { IcategoryId } from '../../interfaces/icategory-id';

@Injectable()
export class RestaurantCategoryService {
    categories: Observable<IcategoryId[]>;

    private categoriesCollection: AngularFirestoreCollection<Icategory>;

    constructor(
        private afs: AngularFirestore,
        private subscriptions: SubscriptionsService
    ) {
        this.categoriesCollection = this.afs.collection<Icategory>(
            'restaurant-categories'
        );
        this.categories = this.categoriesCollection
            .snapshotChanges()
            .takeUntil(this.subscriptions.unsubscribe)
            .map(actions => {
                return actions.map(action => {
                    const data = action.payload.doc.data() as Icategory;
                    const id = action.payload.doc.id;
                    return { id, ...data };
                });
            });
    }

    getCategories(): Observable<IcategoryId[]> {
        return this.afs
            .collection<Icategory>('restaurant-categories')
            .snapshotChanges()
            .takeUntil(this.subscriptions.unsubscribe)
            .map(actions => {
                return actions.map(action => {
                    const data = action.payload.doc.data() as Icategory;
                    const id = action.payload.doc.id;
                    return { id, ...data };
                });
            });
    }
}
