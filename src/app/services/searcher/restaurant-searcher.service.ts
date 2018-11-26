import { Injectable } from '@angular/core';

import { RestaurantService } from '../restaurant/restaurant.service';
import { MenuItemService } from '../restaurant/menu-item.service';
import { Restaurant } from '../../models/restaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

const noRestaurantPhotoURL = './assets/img/norestaurantphoto.png';

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
                const restaurantIds = new Set<string>();
                const resultRestaurants: IrestaurantId[] = [];

                menuItems.forEach(menuItem => {
                    restaurantIds.add(menuItem.restaurantId);
                });
                restaurantIds.forEach(restaurantId => {
                    const restaurant: IrestaurantId = restaurants.find(
                        current => {
                            return current.id === restaurantId;
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

    searchNearbyRestaurants(maxDistance: number): Observable<IrestaurantId[]> {
        if (navigator.geolocation) {
            const positionObservable: Observable<any> = Observable.fromPromise(
                new Promise(position => {
                    navigator.geolocation.getCurrentPosition(position);
                })
            );

            return combineLatest(
                positionObservable,
                this.restaurantService.getRestaurants()
            ).map(([position, restaurants]) => {
                const resultRestaurants: IrestaurantId[] = [];
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                const minRestaurantDistance = new RestaurantDistance();

                restaurants.forEach(restaurant => {
                    const distance = this.calculateDistance(
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
                const resultRestaurants: IrestaurantId[] =
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
        const a =
            0.5 -
            c((lat1 - lat2) * p) / 2 +
            (c(lat2 * p) * c(lat1 * p) * (1 - c((long1 - long2) * p))) / 2;
        const distance = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return distance;
    }
}
