import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapStyleService {

  constructor(private http: HttpClient) { }

  public getStyles(): Observable<any> {
    return this.http.get('./assets/data/map-style.json');
  }

}
