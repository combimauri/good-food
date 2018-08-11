import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserWallComponent } from './user-wall.component';

const routes: Routes = [
    {
        path: '',
        component: UserWallComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserWallRoutingModule {}
