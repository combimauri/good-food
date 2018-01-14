import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

import { AuthenticationService } from './authentication.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class AuthenticationGuardService implements CanActivate {

  constructor(private authService: AuthenticationService, private messageService: MessageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.messageService.hideMessage();
    let authState = this.authService.getAuthState().take(1);
    if (state.url === '/login' || state.url === '/register') {
      return authState.map(user => {
        return this.checkLogIn(user !== null, '/home');
      });
    }
    return authState.map(user => {
      return this.checkLogIn(user === null, '/login');
    });
  }

  checkLogIn(condition, stateUrl): boolean {
    if (condition) {
      this.router.navigate([stateUrl]);
      return false
    }
    return true;
  }

}
