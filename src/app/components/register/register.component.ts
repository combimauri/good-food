import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'food-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;

  password: string;

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }

}
