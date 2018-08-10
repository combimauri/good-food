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
    ): Observable<boolean> | boolean {
        if (navigator.onLine) {
            this.messageService.hideMessage();
            let authState = this.authService.authUser.take(1);
            return authState.map(user => {
                if (
                    state.url === '/login' ||
                    state.url === '/register' ||
                    state.url === '/offline'
                ) {
                    let falseCondition: boolean =
                        state.url === '/offline' ? true : user !== null;
                    return this.checkLogIn(falseCondition, '/home');
                }
                return this.checkLogIn(user === null, '/login');
            });
        }
        if (state.url !== '/offline') {
            this.router.navigate(['/offline']);
            return false;
        }
        return true;
    }

    checkLogIn(falseCondition: boolean, url: string): boolean {
        if (falseCondition) {
            this.router.navigate([url]);
            return false;
        }
        return true;
    }
}
