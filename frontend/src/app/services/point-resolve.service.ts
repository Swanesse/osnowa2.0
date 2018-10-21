import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {Point} from "../models/Point";
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class PointResolveService implements Resolve<any> {

  constructor(private httpService: HttpService) {}

  resolve(route: ActivatedRouteSnapshot){
    return this.httpService.getPoint(route.params['id']);
  }
}
