import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'food-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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

  signUp() {
    this.showLoader = true;
    this.authService.signUpUser(this.user).subscribe(
      response => {
        this.showLoader = false;
        this.router.navigate(['/sign-in']);
      },
      errorResponse => {
        console.log(errorResponse);
        Materialize.toast(JSON.stringify(errorResponse.error.ModelState), 10000);
        this.showLoader = false;
      }
    );
  }

}
