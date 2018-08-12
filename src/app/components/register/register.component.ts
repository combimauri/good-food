import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication/authentication.service';
import { MessageService } from '../../services/message/message.service';
import { InitialLoaderService } from '../../services/initial-loader/initial-loader.service';

@Component({
    selector: 'food-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    email: string;

    password: string;

    confirmPassword: string;

    constructor(
        public authService: AuthenticationService,
        public messageService: MessageService,
        private initialLoader: InitialLoaderService
    ) {}

    ngOnInit() {
        this.initialLoader.hideInitialLoader();
    }
}
