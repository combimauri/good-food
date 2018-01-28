import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';

declare var $: any;
const noDisplayName: string = 'Nuevo Usuario';
const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userName: string;

  userPhotoURL: string;

  @ViewChild("toggleButton")
  private toggleButtonElement: ElementRef;

  constructor(public authService: AuthenticationService, private userService: UserService) {
    this.userName = this.userService.currentUser.displayName === null ?
      noDisplayName : this.userService.currentUser.displayName;
    this.userPhotoURL = this.userService.currentUser.photoURL === null ?
      noPhotoURL : this.userService.currentUser.photoURL;
  }

  ngOnInit(): void {
    $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
  }

}
