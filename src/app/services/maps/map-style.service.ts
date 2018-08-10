import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/takeUntil";

import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class MapStyleService {

  constructor(private http: HttpClient, private subscriptions: SubscriptionsService) { }

  public getStyles(): Observable<any> {
    return this.http.get('./assets/data/map-style.json').takeUntil(this.subscriptions.destroyUnsubscribe);
  }

}
