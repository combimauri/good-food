import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InitialLoaderService } from '../../../services/initial-loader/initial-loader.service';

@Component({
    selector: 'food-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
    constructor(
        private router: Router,
        private initialLoader: InitialLoaderService
    ) {}

    ngOnInit(): void {
        this.initialLoader.hideInitialLoader();
    }

    redirectHome(): void {
        this.router.navigate(['']);
    }
}
