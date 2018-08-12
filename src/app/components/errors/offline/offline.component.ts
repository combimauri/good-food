import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InitialLoaderService } from '../../../services/initial-loader/initial-loader.service';

@Component({
    selector: 'food-offline',
    templateUrl: './offline.component.html',
    styleUrls: ['./offline.component.scss']
})
export class OfflineComponent implements OnInit {
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
