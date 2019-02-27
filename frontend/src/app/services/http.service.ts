import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Point} from "../models/Point";


import {InMemoryDbService} from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class HttpService{

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
      formData.append('images', file, file.name);
    }

    return this.http.post<Point>('http://localhost:8000/point/new', formData);
  }

  editPoint(point: Point, fileToUpload: File[]): Observable<Point> {
    const formData: FormData = new FormData();
    Object.keys(point).forEach(key => {
      if (point[key] !== null && point[key] !== undefined) {
        formData.append(key, point[key].toString());
      }
    });

    for (let file of fileToUpload) {
      formData.append('images', file, file.name);
    }

    return this.http.put<Point>('http://localhost:8000/point/edit', formData);
  }

  getPoint(id) {
    const param = new HttpParams().set('id', id + '');
    return this.http.get('http://localhost:8000/point/get', {params: {id: id}});
    // .toPromise()
    // .then(response => response.json().data as Point)
    // .catch(this.handleError);
  }

  // handleError(error: any): Promise<any> {
  //   console.error('BŁĄD!!!', error);
  //   return Promise.reject(error.message || error);
  // }

  viewPoints(north, south, east, west): Observable<Array<Point>> {
    return this.http.get<Array<Point>>('http://localhost:8000/point/get-all', {
      params: {
        north: north,
        south: south,
        east: east,
        west: west
      }
    });
  }

  searchPoint(searchCondition): Observable<Array<Point>>{
    return this.http.get<Array<Point>>('http://localhost:8000/point/search', {
      params: {
        searchCondition: searchCondition
      }
    });
  }

  searchPoints(catalogNumber,
  controlType1,
  controlType2,
  controlType3,
  controlClass1,
  controlClass2,
  controlClass3,
  currentView,
  country,
  state,
  district,
  county,
  locality,
  city_district,
  road,
  house_number,
  stabilization,
  found): Observable<Array<Point>>{
    return this.http.get<Array<Point>>('http://localhost:8000/points/search', {
      params: {
        catalogNumber:catalogNumber,
        controlType1:controlType1,
        controlType2:controlType2,
        controlType3:controlType3,
        controlClass1:controlClass1,
        controlClass2:controlClass2,
        controlClass3:controlClass3,
        currentView:currentView,
        country:country,
        state:state,
        district:district,
        county:county,
        locality:locality,
        city_district:city_district,
        road:road,
        house_number:house_number,
        stabilization:stabilization,
        found:found
      }
    });
  }
}

