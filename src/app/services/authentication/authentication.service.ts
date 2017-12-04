import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User } from '../../models/user';
import { Token } from '../../models/token';

@Injectable()
export class AuthenticationService {

  private redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.redirectUrl = '/favourite-food';
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  setRedirectUrl(redirectUrl): void {
    this.redirectUrl = redirectUrl;
  }

  signInUser(user: User): Observable<any> {
    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('grant_type', 'password');
    searchParams.set('username', user.Email);
    searchParams.set('password', user.Password);

    let body: string = searchParams.toString();

    return this.http.post('http://localhost:55961/Token', body);
  }

  signUpUser(user: User): Observable<any> {
    return this.http.post('http://localhost:55961/api/Account/Register', user);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  saveToken(token: Token): void {
    localStorage.setItem('token', JSON.stringify(token));
  }
}
