import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class HomeService {
    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) {}

    goHome(): void {
        this.getHomeURL().subscribe(url => {
            this.router.navigate([url]);
        });
    }

    getHomeURL(): Observable<string> {
        return this.authService.isAppUserARestaurant().map(isRestaurant => {
            if (isRestaurant) {
                let currentUser = this.authService.appUserService.getCurrentAppUser();
                return '/restaurant-profile/' + currentUser.id;
            }
            return '/home';
        });
    }
}
