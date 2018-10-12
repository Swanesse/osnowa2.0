import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Rx";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Point} from "../models/Point";
import 'rxjs/add/operator/map'

import {InMemoryDbService} from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class HttpService implements InMemoryDbService {

  constructor(private http: HttpClient) {
  }

  addPoint(point: Point, fileToUpload: File[]): Observable<Point> {
    const formData: FormData = new FormData();
    Object.keys(point).forEach(key => {
      if (point[key] !== null && point[key] !== undefined) {
        formData.append(key, point[key].toString());
      }
    });
    for (let file of fileToUpload) {
      formData.append('image', file, file.name);
    }

    return this.http.post<Point>('http://localhost:8000/point/new', formData);
  }

  getPoint(id): Observable<Point> {
    const param = new HttpParams().set('id', id + '');
    return this.http.get<Point>('http://localhost:8000/point/get', {params: {param: id}});
    // .toPromise()
    // .then(response => response.json().data as Point)
    // .catch(this.handleError);
  }

  // handleError(error: any): Promise<any> {
  //   console.error('BŁĄD!!!', error);
  //   return Promise.reject(error.message || error);
  // }

  viewPoints(north, south, east, west): Observable<Array<Point>> {
    return this.http.get<Array<Point>>('http://localhost:8000/point/view', {
      params: {
        north: north,
        south: south,
        east: east,
        west: west
      }
    });
  }

  createDb() {
    let users = [
      {id: 1, name: 'Tomasz'},
      {id: 2, name: 'Marcin'},
      {id: 3, name: 'Robert'},
      {id: 4, name: 'Joanna'},
      {id: 5, name: 'Anna'}
    ];
    return {users};
  }
}


