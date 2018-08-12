import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { SubscriptionsService } from './services/subscriptions/subscriptions.service';

@Component({
    selector: 'food-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private afs: AngularFirestore,
        private router: Router,
        private subscriptions: SubscriptionsService
    ) {
        this.afs.firestore.settings({ timestampsInSnapshots: true });
        this.router.errorHandler = _ => {
            if (!navigator.onLine) {
                this.router.navigate(['/offline']);
                this.subscriptions.onDestroyKill();
            }
        };
    }
}
