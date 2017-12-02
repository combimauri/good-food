import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'food-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.parallax').parallax();
  }

}
