import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { Order, OrderState } from '../../interfaces/order';

@Injectable()
export class OrderService {
    constructor(private afs: AngularFirestore) {}

    getOrdersByRestaurant(
        restaurantId: string,
        state: OrderState
    ): Observable<Array<Order>> {
        return this.afs
            .collection<Order>('orders', ref =>
                ref
                    .where('restaurantId', '==', restaurantId)
                    .where('state', '==', state)
                    .orderBy('date', 'asc')
            )
            .valueChanges();
    }

    saveOrder(order: Order): void {
        order.id = this.afs.createId();
        this.setOrder(order);
    }

    private setOrder(order: Order): void {
        this.afs
            .collection<Order>('orders')
            .doc(order.id)
            .set(order, { merge: true });
    }
}
