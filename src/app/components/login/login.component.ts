import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MessageService } from '../../services/message/message.service';
import { InitialLoaderService } from '../../services/initial-loader/initial-loader.service';

@Component({
    selector: 'food-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    email: string;

    password: string;

    constructor(
        public authService: AuthenticationService,
        public messageService: MessageService,
        private initialLoader: InitialLoaderService
    ) {}

    ngOnInit(): void {
        this.initialLoader.hideInitialLoader();
    }
}
