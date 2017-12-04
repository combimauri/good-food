import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'food-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.scss']
})
export class RestaurantProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.parallax').parallax();
  }

}
