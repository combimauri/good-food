import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RestaurantCategoryService } from '../../services/restaurant/restaurant-category.service';
import { IcategoryId } from '../../interfaces/icategory-id';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';


@Component({
    selector: 'food-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent {
    categories: Observable<IcategoryId[]>;

    searchedCategoryId: string;

    minPrice: number;

    maxPrice: number;

    constructor(
        public searchService: RestaurantSearcherService,
        private categoryService: RestaurantCategoryService
    ) {
        this.categories = this.categoryService.getCategories();
    }

    search(): void {
        let minPrice = this.minPrice ? this.minPrice : 0;
        let maxPrice = this.maxPrice ? this.maxPrice : 0;
        this.searchService.searchByRangePrice(minPrice, maxPrice);

        if (this.searchedCategoryId) {
            this.searchService.searchByCategoryId(this.searchedCategoryId);
        }
    }
}
