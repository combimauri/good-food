import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppUserService } from '../user/app-user.service';

@Injectable()
export class HomeService {
    constructor(
        private appUserService: AppUserService,
        private router: Router
    ) {}

    goHome(): void {
        let currentUser = this.appUserService.getCurrentAppUser();
        if (currentUser.isRestaurant) {
            this.router.navigate(['/restaurant-profile', currentUser.id]);
        } else {
            this.router.navigate(['/home']);
        }
    }
}
