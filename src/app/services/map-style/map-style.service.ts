import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MapStyleService {

  constructor(private http: HttpClient) { }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/map-style.json');
  }

}
