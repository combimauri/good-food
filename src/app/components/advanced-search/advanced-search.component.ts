import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IcategoryId } from '../../interfaces/icategory-id';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';
import { Restaurant } from '../../models/restaurant';
import { IrestaurantId } from '../../interfaces/irestaurant-id';

@Component({
    selector: 'food-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent {
    categories: Observable<IcategoryId[]>;

    searchedCategoryId: string;

    onlyNearbyRestaurants: boolean;

    minPrice: number;

    maxPrice: number;

    resultRestaurants: Restaurant[];

    showMessage: boolean;

    private searchObservables: Observable<IrestaurantId[]>[];

    private searchSubscription: Subscription;

    constructor(
        public searchService: RestaurantSearcherService,
        private categoryService: RestaurantCategoryService
    ) {
        this.categories = this.categoryService.getCategories();
        this.onlyNearbyRestaurants = false;
        this.showMessage = false;
        this.resultRestaurants = [];
        this.searchObservables = [];
    }

    search(): void {
        this.searchObservables = [];
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
        let minPrice = this.minPrice ? this.minPrice : 0;
        let maxPrice = this.maxPrice ? this.maxPrice : 0;
        if (minPrice || maxPrice) {
            this.searchObservables.push(
                this.searchService.searchByRangePrice(minPrice, maxPrice)
            );
        }

        if (
            this.searchedCategoryId &&
            this.searchedCategoryId !== 'undefined'
        ) {
            this.searchObservables.push(
                this.searchService.searchByCategoryId(this.searchedCategoryId)
            );
        }

        if (this.onlyNearbyRestaurants) {
            this.searchObservables.push(
                this.searchService.searchNearbyRestaurants()
            );
        }

        this.searchSubscription = combineLatest(...this.searchObservables)
            .map(searchResults => {
                let restaurantResults: IrestaurantId[] = [];
                if (searchResults.length === 1) {
                    searchResults[0].forEach(restaurant => {
                        {
                            restaurantResults.push(restaurant);
                        }
                    });
                } else {
                    searchResults.forEach(results => {
                        results.forEach(restaurant => {
                            if (
                                this.isRestauranInAllSearchResults(
                                    restaurant,
                                    searchResults
                                )
                            ) {
                                this.addRestaurantToResult(
                                    restaurant,
                                    restaurantResults
                                );
                            }
                        });
                    });
                }
                return restaurantResults;
            })
            .subscribe(restaurants => {
                this.resultRestaurants = restaurants;
                this.showMessage = this.resultRestaurants.length === 0;
            });
    }

    private isRestauranInAllSearchResults(
        restaurant: IrestaurantId,
        searchResults: IrestaurantId[][]
    ): boolean {
        for (let results of searchResults) {
            let index: number = results.findIndex(r => r.id === restaurant.id);
            if (index < 0) {
                return false;
            }
        }
        return true;
    }

    private addRestaurantToResult(
        restaurant: IrestaurantId,
        result: IrestaurantId[]
    ): void {
        let index: number = result.findIndex(r => r.id === restaurant.id);
        if (index < 0) {
            result.push(restaurant);
        }
    }
}
