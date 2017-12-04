import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { User } from '../../../models/user';
import { Token } from '../../../models/token';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'food-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  user: User;
  showLoader: boolean;

  constructor(private authService: AuthenticationService, private router: Router) {
    this.user = new User();
    this.showLoader = false;
  }

  ngOnInit() {
    $(document).ready(function () {
      Materialize.updateTextFields();
    });
  }

  signIn(): void {
    this.showLoader = true;
    this.authService.signInUser(this.user).subscribe(
      response => {
        let token: Token = new Token(
          response.access_token,
          response.token_type,
          response.userName
        );
        this.authService.saveToken(token);
        this.showLoader = false;
        this.router.navigate([this.authService.getRedirectUrl()]);
      },
      errorResponse => {
        Materialize.toast(errorResponse.error.error_description, 10000);
        this.showLoader = false;
      }
    );
  }

}
