import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'food-favourite-food-selector',
  templateUrl: './favourite-food-selector.component.html',
  styleUrls: ['./favourite-food-selector.component.scss']
})
export class FavouriteFoodSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.carousel').carousel();
  }

}
