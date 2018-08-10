import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantMenuRoutingModule } from './restaurant-menu-routing.module';
import { RestaurantMenuComponent } from './restaurant-menu.component';

@NgModule({
    imports: [CommonModule, FormsModule, RestaurantMenuRoutingModule],
    declarations: [RestaurantMenuComponent]
})
export class RestaurantMenuModule {}
