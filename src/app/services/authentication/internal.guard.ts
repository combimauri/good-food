import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './authentication.service';
import { HomeService } from '../home/home.service';

@Injectable()
export class InternalGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private homeService: HomeService
    ) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAppUserARestaurant().map(isRestaurant => {
            if (isRestaurant) {
                this.homeService.goHome();
            }
            return !isRestaurant;
        });
    }
}
