import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantMenuRoutingModule } from './restaurant-menu-routing.module';
import { RestaurantMenuComponent } from './restaurant-menu.component';
import { FoodOrdersComponent } from '../food-orders/food-orders.component';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';
import { OrderService } from '../../services/restaurant/order.service';

@NgModule({
    imports: [CommonModule, FormsModule, RestaurantMenuRoutingModule],
    declarations: [RestaurantMenuComponent, FoodOrdersComponent],
    providers: [RestaurantSearcherService, OrderService]
})
export class RestaurantMenuModule {}
