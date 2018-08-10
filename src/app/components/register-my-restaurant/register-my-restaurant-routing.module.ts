import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterMyRestaurantComponent } from './register-my-restaurant.component';

const routes: Routes = [
    {
        path: '',
        component: RegisterMyRestaurantComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RegisterMyRestaurantRoutingModule {}
