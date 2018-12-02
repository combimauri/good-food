import { OrderItem } from './order-item';

export enum OrderState {
    CREATED = 'created',
    IN_PROCESS = 'inProgress',
    COMPLETED = 'completed',
    PAID = 'paid'
}

export interface Order {
    id: string;
    restaurantId: string;
    userId: string;
    clientName: string;
    tableNumber: string;
    items: Array<OrderItem>;
    total: number;
    date: Date;
    state: OrderState;
    lat: number;
    lng: number;
}
