import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

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

  constructor(public authService: AuthenticationService) {
    this.userName = this.authService.currentUser.displayName === null ?
      noDisplayName : this.authService.currentUser.displayName;
    this.userPhotoURL = this.authService.currentUser.photoURL === null ?
      noPhotoURL : this.authService.currentUser.photoURL;
  }

  ngOnInit(): void {
    $(this.toggleButtonElement.nativeElement).pushMenu('toggle');
  }

}
