import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'food-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;

  password: string;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

  logInWithEmail() {
    this.authService.logInWithEmail(this.email, this.password);
  }

}
