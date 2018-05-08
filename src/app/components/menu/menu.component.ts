import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

declare const $: any;
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userPhotoURL: string;

  @ViewChild("toggleButton")
  private toggleButtonElement: ElementRef;

  constructor(public authService: AuthenticationService, private subscriptions: SubscriptionsService) {
    this.loadUserProfilePicture();
  }

  ngOnInit(): void {
    $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
  }

  private loadUserProfilePicture(): void {
    this.userPhotoURL = noPhotoURL;
    this.authService.authUser.takeUntil(this.subscriptions.unsubscribe).subscribe(
      (user) => {
        this.userPhotoURL = user.photoURL;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
