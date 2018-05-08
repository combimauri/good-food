import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';

declare var $: any;

@Component({
  selector: 'food-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @ViewChild("toggleButton")
  private toggleButtonElement: ElementRef;

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
    $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
  }

}
