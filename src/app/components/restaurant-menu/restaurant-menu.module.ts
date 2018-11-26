import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantMenuRoutingModule } from './restaurant-menu-routing.module';
import { RestaurantMenuComponent } from './restaurant-menu.component';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';

@NgModule({
    imports: [CommonModule, FormsModule, RestaurantMenuRoutingModule],
    declarations: [RestaurantMenuComponent],
    providers: [RestaurantSearcherService]
})
export class RestaurantMenuModule {}
