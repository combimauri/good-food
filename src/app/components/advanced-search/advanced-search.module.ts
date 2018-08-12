import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdvancedSearchRoutingModule } from './advanced-search-routing.module';
import { AdvancedSearchComponent } from './advanced-search.component';
import { RestaurantSearcherService } from '../../services/searcher/restaurant-searcher.service';

@NgModule({
    imports: [CommonModule, FormsModule, AdvancedSearchRoutingModule],
    declarations: [AdvancedSearchComponent],
    providers: [RestaurantSearcherService]
})
export class AdvancedSearchModule {}
