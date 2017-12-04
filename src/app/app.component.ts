import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './services/authentication/authentication.service';

declare var $: any;

@Component({
  selector: 'food-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    $(".button-collapse").sideNav();
  }

}
