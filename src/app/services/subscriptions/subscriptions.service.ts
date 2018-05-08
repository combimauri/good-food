import { Injectable } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SubscriptionsService {

  unsubscribe: Subject<void>;

  constructor() {
    this.revive();
  }

  revive(): void {
    this.unsubscribe = new Subject();
  }

  kill(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
