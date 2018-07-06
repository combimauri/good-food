import { Injectable } from '@angular/core';

import { RestaurantService } from '../restaurant/restaurant.service';
import { MenuItemService } from '../restaurant/menu-item.service';
import { Restaurant } from '../../models/restaurant';

const noRestaurantPhotoURL: string = './assets/img/good-food-4.png';

@Injectable()
export class RestaurantSearcherService {
    resultRestaurants: Restaurant[];

    constructor(
        private restaurantService: RestaurantService,
        private menuItemService: MenuItemService
    ) {
        this.resultRestaurants = [];
    }

    searchByRangePrice(minPrice: number, maxPrice: number): void {
        if (minPrice || maxPrice) {
            this.menuItemService
                .getMenuItemsByPriceRange(minPrice, maxPrice)
                .subscribe(menuItems => {
                    let restaurantIds = new Set<string>();
                    menuItems.forEach(menuItem => {
                        restaurantIds.add(menuItem.restaurantId);
                    });
                    restaurantIds.forEach(restaurantId => {
                        this.restaurantService
                            .getRestaurant(restaurantId)
                            .subscribe(restaurant => {
                                let resultRestaurant: Restaurant = {
                                    id: restaurantId,
                                    ...restaurant
                                };
                                this.setRestaurantPicture(resultRestaurant);
                                this.resultRestaurants.push(resultRestaurant);
                            });
                    });
                });
        }
    }

    searchByCategoryId(categoryId: string): void {
        this.restaurantService
            .getRestaurantsByCategoryId(categoryId)
            .subscribe(restaurants => {
                this.resultRestaurants = restaurants;
                this.resultRestaurants.forEach(current => {
                    this.setRestaurantPicture(current);
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
