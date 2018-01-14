import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  message: string;
  
  messageClass: string;

  messageIcon: string;

  showMessage: boolean;

  constructor() {
    this.message = '';
    this.messageClass = '';
    this.messageIcon = '';
    this.showMessage = false;
  }

  setMessage(message, messageClass, messageIcon) {
    this.message = message;
    this.messageClass = messageClass;
    this.messageIcon = messageIcon;
    this.showMessage = true;
  }

  hideMessage() {
    this.message = '';
    this.messageClass = '';
    this.messageIcon = '';
    this.showMessage = false;
  }

}
