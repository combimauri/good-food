import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'food-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    $(".button-collapse").sideNav();
  }

}
