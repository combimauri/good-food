import { Injectable } from '@angular/core';

import { RestaurantService } from '../restaurant/restaurant.service';
import { MenuItemService } from '../restaurant/menu-item.service';
import { Restaurant } from '../../models/restaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

const noRestaurantPhotoURL: string = './assets/img/norestaurantphoto.png';
const maxDistance: number = 0.5;

export class RestaurantDistance {
    distance: number;
    restaurant: IrestaurantId;
}

@Injectable()
export class RestaurantSearcherService {
    constructor(
        private restaurantService: RestaurantService,
        private menuItemService: MenuItemService
    ) {}

    searchByRangePrice(
        minPrice: number,
        maxPrice: number
    ): Observable<IrestaurantId[]> {
        if (minPrice || maxPrice) {
            return combineLatest(
                this.menuItemService.getMenuItemsByPriceRange(
                    minPrice,
                    maxPrice
                ),
                this.restaurantService.getRestaurants()
            ).map(([menuItems, restaurants]) => {
                let restaurantIds = new Set<string>();
                let resultRestaurants: IrestaurantId[] = [];

                menuItems.forEach(menuItem => {
                    restaurantIds.add(menuItem.restaurantId);
                });
                restaurantIds.forEach(restaurantId => {
                    let restaurant: IrestaurantId = restaurants.find(
                        restaurant => {
                            return restaurant.id === restaurantId;
                        }
                    );
                    this.setRestaurantPicture(restaurant);
                    resultRestaurants.push(restaurant);
                });
                return resultRestaurants;
            });
        }
        return Observable.of([]);
    }

    searchNearbyRestaurants(): Observable<IrestaurantId[]> {
        if (navigator.geolocation) {
            let positionObservable: Observable<any> = Observable.fromPromise(
                new Promise(position => {
                    navigator.geolocation.getCurrentPosition(position);
                })
            );

            return combineLatest(
                positionObservable,
                this.restaurantService.getRestaurants()
            ).map(([position, restaurants]) => {
                let resultRestaurants: IrestaurantId[] = [];
                let currentLat = position.coords.latitude;
                let currentLng = position.coords.longitude;
                let minRestaurantDistance = new RestaurantDistance();

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

                    if (distance <= maxDistance) {
                        this.setRestaurantPicture(restaurant);
                        resultRestaurants.push(restaurant);
                    }
                });

                if (resultRestaurants.length === 0) {
                    this.setRestaurantPicture(minRestaurantDistance.restaurant);
                    resultRestaurants.push(minRestaurantDistance.restaurant);
                }

                return resultRestaurants;
            });
        }
        return Observable.of([]);
    }

    searchByCategoryId(categoryId: string): Observable<IrestaurantId[]> {
        return this.restaurantService
            .getRestaurantsByCategoryId(categoryId)
            .map(restaurants => {
                let resultRestaurants: IrestaurantId[] =
                    restaurants.length > 0 ? restaurants : [];

                resultRestaurants.forEach(current => {
                    this.setRestaurantPicture(current);
                });

                return resultRestaurants;
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
    ): number {
        const p = 0.017453292519943295; // Math.PI / 180
        const c = Math.cos;
        let a =
            0.5 -
            c((lat1 - lat2) * p) / 2 +
            (c(lat2 * p) * c(lat1 * p) * (1 - c((long1 - long2) * p))) / 2;
        let distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return distance;
    }
}
