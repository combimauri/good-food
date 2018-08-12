import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

import { RestaurantProfileRoutingModule } from './restaurant-profile-routing.module';
import { RestaurantProfileComponent } from './restaurant-profile.component';
import { ReviewComponent } from '../review/review.component';
import { ReviewService } from '../../services/score/review.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StarRatingModule.forRoot(),
        RestaurantProfileRoutingModule
    ],
    declarations: [RestaurantProfileComponent, ReviewComponent],
    providers: [ReviewService]
})
export class RestaurantProfileModule {}
