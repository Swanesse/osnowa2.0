import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MapService {
  private _listners = new Subject<any>();
  private _listners2 = new Subject<any>();
  private _listners3 = new Subject<any>();

  constructor(private http: HttpClient) {
  }

  getPost(latlong): Observable<any> {
    return this.http.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + latlong[0] + '&lon=' + latlong[1]);
  }

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  filter(filterBy) {
    this._listners.next(filterBy);
  }

  listen2(): Observable<any> {
    return this._listners2.asObservable();
  }

  filter2(filterBy) {
    this._listners2.next(filterBy);
  }


  listen3(): Observable<any> {
    return this._listners.asObservable();
  }

  filter3(filterBy) {
    this._listners.next(filterBy);
  }
}
