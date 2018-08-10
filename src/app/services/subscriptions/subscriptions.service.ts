import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SubscriptionsService {
    destroyUnsubscribe: Subject<void>;

    homeUnsubscribe: Subject<void>;

    constructor() {
        this.onLoginRevive();
    }

    onLoginRevive(): void {
        this.destroyUnsubscribe = new Subject();
    }

    onDestroyKill(): void {
        this.destroyUnsubscribe.next();
        this.destroyUnsubscribe.complete();
    }

    homeRevive(): void {
        this.homeUnsubscribe = new Subject();
    }

    homeKill(): void {
        this.homeUnsubscribe.next();
        this.homeUnsubscribe.complete();
    }
}
