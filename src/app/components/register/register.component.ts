import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'food-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;

  password: string;

  confirmPassword: string;

  constructor(public authService: AuthenticationService, public messageService: MessageService) { }

  ngOnInit() {
  }

}
