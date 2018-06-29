import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../authentication/authentication.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

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
        return combineLatest(
            this.authService.isAppUserARestaurant(),
            this.authService.getCurrentAppUser()
        ).map(([isRestaurant, currentUser]) => {
            if (isRestaurant) {
                return '/restaurant-profile/' + currentUser.id;
            }
            return '/home';
        });
    }
}
