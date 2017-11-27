import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var Materialize: any;
@Component({
  selector: 'food-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  ngOnInit() {
    $(document).ready(function () {
      $('.slider').slider();
    });
  }

}
