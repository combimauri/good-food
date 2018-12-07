import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantMenuComponent } from './restaurant-menu.component';
import { FoodOrdersComponent } from '../food-orders/food-orders.component';

const routes: Routes = [
    {
        path: '',
        component: RestaurantMenuComponent
    },
    {
        path: 'orders',
        component: FoodOrdersComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestaurantMenuRoutingModule {}
