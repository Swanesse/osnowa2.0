import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getPosts(lat, long) {
    return this.http.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + long);
    }
  }
