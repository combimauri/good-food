import { Injectable } from '@angular/core';
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

@Injectable()
export class AuthenticationGuardService implements CanActivate {
    constructor(
        private messageService: MessageService,
        private authService: AuthenticationService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        if (navigator.onLine) {
            this.messageService.hideMessage();
            let authState = this.authService.authUser.take(1);
            if (state.url === '/login' || state.url === '/register') {
                return authState.map(user => {
                    return this.checkLogIn(user !== null, '/home');
                });
            }
            return authState.map(user => {
                return this.checkLogIn(user === null, '/login');
            });
        }
        this.router.navigate(['/404']);
        return Observable.of(false);
    }

    checkLogIn(condition: boolean, url: string): boolean {
        if (condition) {
            this.router.navigate([url]);
            return false;
        }
        return true;
    }
}
