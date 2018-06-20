import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MapService {
  private _listners = new Subject<any>();
  private _listners2 = new Subject<any>();

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
}
