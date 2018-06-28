import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';
import { IuserId } from '../../interfaces/iuser-id';
import { AppUserService } from '../user/app-user.service';

@Injectable()
export class InternalGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private appUserService: AppUserService
    ) {}

    canActivate(): Observable<boolean> {
        let authState = this.authService.authUser.take(1);

        return authState.map(user => {
            return this.checkAccess(user);
        });
    }

    checkAccess(user: IuserId): boolean {
        if (user.roles['businessOwner']) {
            return !this.appUserService.getCurrentAppUser().isRestaurant;
        }
        return true;
    }
}
