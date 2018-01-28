import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  message: string;

  messageClass: string;

  messageIcon: string;

  showMessage: boolean;

  constructor() {
    this.hideMessage();
  }

  setMessage(message: string, messageClass: string, messageIcon: string): void {
    this.message = message;
    this.messageClass = messageClass;
    this.messageIcon = messageIcon;
    this.showMessage = true;
  }

  hideMessage(): void {
    this.message = '';
    this.messageClass = '';
    this.messageIcon = '';
    this.showMessage = false;
  }

}
