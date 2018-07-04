import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Restaurant } from '../../models/restaurant';

const noRestaurantPhotoURL: string = './assets/img/noRestaurantPhoto.png';

@Component({
    selector: 'food-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    restaurants: Restaurant[];

    constructor(private restaurantService: RestaurantService) {
        this.restaurants = [];
    }

    ngOnInit(): void {
        this.restaurantService.getRestaurants().subscribe(restaurants => {
            this.restaurants = restaurants;
            this.restaurants.forEach(restaurant => {
                this.setRestaurantPicture(restaurant);
            });
        });
    }

    private setRestaurantPicture(restaurant: Restaurant): void {
        restaurant.photoURL = noRestaurantPhotoURL;
        if (restaurant.hasProfilePic) {
            this.restaurantService
                .getRestaurantProfilePic(restaurant.id)
                .subscribe(url => {
                    restaurant.photoURL = url;
                });
        }
    }
}
