import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { RestaurantsMapRoutingModule } from './restaurants-map-routing.module';
import { RestaurantsMapComponent } from './restaurants-map.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AgmCoreModule,
        LoaderModule,
        RestaurantsMapRoutingModule
    ],
    declarations: [RestaurantsMapComponent]
})
export class RestaurantsMapModule {}
