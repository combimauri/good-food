import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantMenuComponent } from './restaurant-menu.component';

const routes: Routes = [
    {
        path: '',
        component: RestaurantMenuComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestaurantMenuRoutingModule {}
