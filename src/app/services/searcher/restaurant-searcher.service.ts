import { Injectable } from '@angular/core';

import { RestaurantService } from '../restaurant/restaurant.service';
import { MenuItemService } from '../restaurant/menu-item.service';
import { Restaurant } from '../../models/restaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

const noRestaurantPhotoURL: string = './assets/img/good-food-4.png';

export class RestaurantDistance {
    distance: number;
    restaurant: IrestaurantId;
}

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

    searchNearbyRestaurants(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let currentLat = position.coords.latitude;
                let currentLng = position.coords.longitude;
                let minRestaurantDistance = new RestaurantDistance();

                this.restaurantService
                    .getRestaurants()
                    .map(restaurants => {
                        let result: IrestaurantId[] = [];

                        restaurants.forEach(restaurant => {
                            let distance = this.calculateDistance(
                                currentLat,
                                restaurant.lat,
                                currentLng,
                                restaurant.lng
                            );

                            if (
                                !minRestaurantDistance.distance ||
                                (minRestaurantDistance.distance &&
                                    minRestaurantDistance.distance > distance)
                            ) {
                                minRestaurantDistance.distance = distance;
                                minRestaurantDistance.restaurant = restaurant;
                            }

                            if (distance <= 0.5) {
                                result.push(restaurant);
                            }
                        });

                        return result;
                    })
                    .subscribe(restaurants => {
                        this.resultRestaurants = restaurants;

                        if (this.resultRestaurants.length === 0) {
                            this.resultRestaurants.push(
                                minRestaurantDistance.restaurant
                            );
                        }

                        this.resultRestaurants.forEach(restaurant => {
                            this.setRestaurantPicture(restaurant);
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

    private calculateDistance(
        lat1: number,
        lat2: number,
        long1: number,
        long2: number
    ) {
        let p = 0.017453292519943295; // Math.PI / 180
        let c = Math.cos;
        let a =
            0.5 -
            c((lat1 - lat2) * p) / 2 +
            (c(lat2 * p) * c(lat1 * p) * (1 - c((long1 - long2) * p))) / 2;
        let distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return distance;
    }
}
