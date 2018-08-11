import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserWallRoutingModule } from './user-wall-routing.module';
import { UserWallComponent } from './user-wall.component';

@NgModule({
    imports: [CommonModule, FormsModule, UserWallRoutingModule],
    declarations: [UserWallComponent]
})
export class UserWallModule {}
