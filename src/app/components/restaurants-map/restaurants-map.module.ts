import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { environment } from '../../../environments/environment';

import { RestaurantsMapRoutingModule } from './restaurants-map-routing.module';
import { RestaurantsMapComponent } from './restaurants-map.component';
import { LoaderModule } from '../loader/loader.module';
import { AgmCustomModule } from '../../modules/agm-custom/agm-custom.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AgmCustomModule.forRoot(),
        // AgmCoreModule.forRoot({
        //     apiKey: environment.googlemaps
        // }),
        LoaderModule,
        RestaurantsMapRoutingModule
    ],
    declarations: [RestaurantsMapComponent]
})
export class RestaurantsMapModule {}
