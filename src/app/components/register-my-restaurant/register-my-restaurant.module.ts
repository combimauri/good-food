import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { RegisterMyRestaurantRoutingModule } from './register-my-restaurant-routing.module';
import { RegisterMyRestaurantComponent } from './register-my-restaurant.component';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AgmCoreModule,
        LoaderModule,
        RegisterMyRestaurantRoutingModule
    ],
    declarations: [RegisterMyRestaurantComponent]
})
export class RegisterMyRestaurantModule {}
