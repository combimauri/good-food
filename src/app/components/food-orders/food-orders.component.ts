import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Order, OrderState } from '../../interfaces/order';
import { OrderService } from '../../services/restaurant/order.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

declare const $: any;

@Component({
    selector: 'food-food-orders',
    templateUrl: './food-orders.component.html',
    styleUrls: ['./food-orders.component.scss']
})
export class FoodOrdersComponent implements OnInit {
    restaurantId: string;
    order: Order;
    nextStateBtnText: string;
    pendingOrders$: Observable<Array<Order>>;
    inProgressOrders$: Observable<Array<Order>>;
    completedOrders$: Observable<Array<Order>>;
    paidOrders$: Observable<Array<Order>>;
    currentModalClass: string;
    modalTitle: string;

    constructor(
        private ordersService: OrderService,
        private authService: AuthenticationService,
        private route: ActivatedRoute
    ) {
        this.order = {
            id: '',
            restaurantId: '',
            userId: '',
            clientName: '',
            tableNumber: '',
            items: [],
            total: 0,
            date: new Date(),
            state: OrderState.CREATED,
            lat: 0,
            lng: 0
        };
        this.setButtonText();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.restaurantId = params.id;
            combineLatest(
                this.authService.getCurrentAppUser(),
                this.authService.isAppUserARestaurant()
            )
                .first()
                .subscribe(([appUser, isRestaurant]) => {
                    if (isRestaurant) {
                        this.setOrdersForRestaurantUser();
                    } else {
                        this.setOrdersForClientUser(appUser.id);
                    }
                });
        });
    }

    setCurrentOrder(order: Order) {
        this.order = order;
        this.setButtonText();
    }

    passToNextState() {
        $('#modal-see-order').modal('hide');
        setTimeout(() => {
            switch (this.order.state) {
                case OrderState.CREATED:
                    this.order.state = OrderState.IN_PROCESS;
                    this.updateOrder();
                    break;
                case OrderState.IN_PROCESS:
                    this.order.state = OrderState.COMPLETED;
                    this.updateOrder();
                    break;
                case OrderState.COMPLETED:
                    this.order.state = OrderState.PAID;
                    this.updateOrder();
                    break;
                case OrderState.PAID:
                    this.order.state = OrderState.ARCHIVED;
                    this.updateOrder();
                    break;
                default:
                    break;
            }
            if (this.order.state !== OrderState.ARCHIVED) {
                $('#modal-see-order').modal('show');
            }
        }, 500);
    }

    private setOrdersForRestaurantUser(): void {
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
    }

    private setOrdersForClientUser(clientId: string): void {
        this.pendingOrders$ = this.ordersService.getOrdersByRestaurantAndUser(
            this.restaurantId,
            clientId,
            OrderState.CREATED
        );
        this.inProgressOrders$ = this.ordersService.getOrdersByRestaurantAndUser(
            this.restaurantId,
            clientId,
            OrderState.IN_PROCESS
        );
        this.completedOrders$ = this.ordersService.getOrdersByRestaurantAndUser(
            this.restaurantId,
            clientId,
            OrderState.COMPLETED
        );
        this.paidOrders$ = this.ordersService.getOrdersByRestaurantAndUser(
            this.restaurantId,
            clientId,
            OrderState.PAID
        );
    }

    private updateOrder() {
        this.ordersService.updateOrder(this.order);
        this.setButtonText();
    }

    private setButtonText() {
        switch (this.order.state) {
            case OrderState.CREATED:
                this.modalTitle = 'Detalle del pedido en espera';
                this.nextStateBtnText = 'Marcar como "En Proceso"';
                this.currentModalClass = 'modal-warning';
                break;
            case OrderState.IN_PROCESS:
                this.modalTitle = 'Detalle del pedido en progreso';
                this.nextStateBtnText = 'Marcar como "Listo Para Servir"';
                this.currentModalClass = 'modal-success';
                break;
            case OrderState.COMPLETED:
                this.modalTitle = 'Detalle del pedido listo para servir';
                this.nextStateBtnText = 'Marcar como "Pagado"';
                this.currentModalClass = 'modal-info';
                break;
            default:
                this.modalTitle = 'Detalle del pedido pagado';
                this.nextStateBtnText = 'Archivar pedido';
                this.currentModalClass = 'modal-danger';
                break;
        }
    }
}
