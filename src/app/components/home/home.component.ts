import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Restaurant } from '../../models/restaurant';
import { Router } from '@angular/router';

declare const $: any;
const noRestaurantPhotoURL: string = './assets/img/norestaurantphoto.png';

@Component({
    selector: 'food-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    restaurants: Restaurant[];

    constructor(
        private restaurantService: RestaurantService,
        private router: Router
    ) {
        this.restaurants = [];
    }

    ngOnInit(): void {
        $('.select2')
            .select2({
                placeholder: 'Buscar restaurante...',
                language: {
                    noResults: params => {
                        return 'No hay resultados...';
                    }
                }
            })
            .on('change', event => {
                let restaurantId = event.target.value;
                if (restaurantId) {
                    this.router.navigate(['/restaurant-profile', restaurantId]);
                }
            });

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
