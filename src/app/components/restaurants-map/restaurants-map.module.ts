import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RestaurantsMapRoutingModule } from './restaurants-map-routing.module';
import { RestaurantsMapComponent } from './restaurants-map.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        RestaurantsMapRoutingModule,
    ],
    declarations: []
})
export class RestaurantsMapModule {}
