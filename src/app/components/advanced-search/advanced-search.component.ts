import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IcategoryId } from '../../interfaces/icategory-id';
import { RestaurantService } from '../../services/restaurant/restaurant.service';
import { Restaurant } from '../../models/restaurant';

const noRestaurantPhotoURL: string = './assets/img/good-food-4.png';

@Component({
    selector: 'food-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
    categories: Observable<IcategoryId[]>;

    searchedCategoryId: string;

    resultRestaurants: Restaurant[];

    constructor(
        private restaurantService: RestaurantService,
        private categoryService: RestaurantCategoryService
    ) {
        this.categories = this.categoryService.getCategories();
        this.resultRestaurants = [];
    }

    ngOnInit() {}

    search(): void {
        if (this.searchedCategoryId) {
            this.restaurantService
                .getRestaurantsByCategoryId(this.searchedCategoryId)
                .subscribe(restaurants => {
                    this.resultRestaurants = restaurants;
                    this.resultRestaurants.forEach(current => {
                        this.setRestaurantPicture(current);
                    });
                });
        }
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
