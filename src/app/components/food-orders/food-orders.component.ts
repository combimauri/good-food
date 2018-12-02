import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Order, OrderState } from '../../interfaces/order';
import { OrderService } from '../../services/restaurant/order.service';

@Component({
    selector: 'food-food-orders',
    templateUrl: './food-orders.component.html',
    styleUrls: ['./food-orders.component.scss']
})
export class FoodOrdersComponent implements OnInit {
    restaurantId: string;
    pendingOrders$: Observable<Array<Order>>;
    inProgressOrders$: Observable<Array<Order>>;
    completedOrders$: Observable<Array<Order>>;
    paidOrders$: Observable<Array<Order>>;

    constructor(
        private ordersService: OrderService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.restaurantId = params.id;
            this.pendingOrders$ = this.ordersService.getOrdersByRestaurant(
                this.restaurantId,
                OrderState.CREATED
            );
            this.inProgressOrders$ = this.ordersService.getOrdersByRestaurant(
                this.restaurantId,
                OrderState.IN_PROCESS
            );
            this.completedOrders$ = this.ordersService.getOrdersByRestaurant(
                this.restaurantId,
                OrderState.COMPLETED
            );
            this.paidOrders$ = this.ordersService.getOrdersByRestaurant(
                this.restaurantId,
                OrderState.PAID
            );
        });
    }
}
