import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantProfileComponent } from './restaurant-profile.component';

const routes: Routes = [
    {
        path: '',
        component: RestaurantProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RestaurantProfileRoutingModule {}
