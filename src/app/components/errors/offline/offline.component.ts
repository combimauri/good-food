import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'food-offline',
    templateUrl: './offline.component.html',
    styleUrls: ['./offline.component.scss']
})
export class OfflineComponent {
    constructor(private router: Router) {}

    goHome(): void {
        this.router.navigate(['/home']);
    }
}
