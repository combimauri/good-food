import { Injectable, state } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AuthenticationService } from './authentication.service';
import { MessageService } from '../message/message.service';
import { HomeService } from '../home/home.service';

@Injectable()
export class AuthenticationGuardService implements CanActivate {
    constructor(
        private messageService: MessageService,
        private authService: AuthenticationService,
        private homeService: HomeService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        this.messageService.hideMessage();
        let authState = this.authService.authUser.take(1);
        if (state.url === '/login' || state.url === '/register') {
            return authState.map(user => {
                return this.checkLogIn(
                    user !== null,
                    this.homeService.getHomeURL()
                );
            });
        }
        return authState.map(user => {
            return this.checkLogIn(user === null, Observable.of('/login'));
        });
    }

    checkLogIn(condition: boolean, stateUrl: Observable<string>): boolean {
        if (condition) {
            stateUrl.subscribe(url => {
                this.router.navigate([url]);
            });
            return false;
        }
        return true;
    }
}
