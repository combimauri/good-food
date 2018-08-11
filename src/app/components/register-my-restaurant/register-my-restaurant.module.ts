import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { environment } from '../../../environments/environment';

import { RegisterMyRestaurantRoutingModule } from './register-my-restaurant-routing.module';
import { RegisterMyRestaurantComponent } from './register-my-restaurant.component';
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
        RegisterMyRestaurantRoutingModule
    ],
    declarations: [RegisterMyRestaurantComponent]
})
export class RegisterMyRestaurantModule {}
