import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'food-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email: string;

  password: string;

  constructor(public authService: AuthenticationService, public messageService: MessageService) { }

}
