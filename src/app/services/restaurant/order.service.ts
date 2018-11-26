import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { Order } from '../../interfaces/order';

@Injectable()
export class OrderService {
    constructor(private afs: AngularFirestore) {}

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
