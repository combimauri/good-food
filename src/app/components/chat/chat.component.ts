import { Component, OnInit } from '@angular/core';

const noPhotoURL: string = './assets/img/nophoto.png';

@Component({
  selector: 'food-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  noPhotoURL: string;

  constructor() {
    this.noPhotoURL = noPhotoURL;
  }

  ngOnInit() {
  }

}
