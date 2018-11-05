import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import proj4 from 'proj4';

import {registerLocaleData} from "@angular/common";
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-point-details',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})
export class PointDetailComponent {
  point;
  images: Array<string>;
  header: string = 'Szczegóły punktu';
  scrollBar: string = 'auto';

  southernLimitLatitude = -90;
  westernLimitLongitude = -180;

  startLongitude5WGS84 = 14.1400;
  startLongitude6WGS84 = 16.5000;
  startLongitude7WGS84 = 19.5000;
  startLongitude8WGS84 = 22.5000;
  endLongitude8WGS84 = 24.1600;

  startLatitude5WGS84 = 50.25;
  endLatitude5WGS84 = 54.5;
  startLatitude6WGS84 = 49.3300;
  endLatitude6WGS84 = 54.8300;
  startLatitude7WGS84 = 49.0900;
  endLatitude7WGS84 = 54.5000;
  startLatitude8WGS84 = 49.0300;
  endLatitude8WGS84 = 54.4500;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private mapService: MapService) {

    proj4.defs([
      ['EPSG:2176', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2177', '+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2178', '+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2179', '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs']
    ]);

    route.params.subscribe(val => {
      this.point = this.route.snapshot.data.point.data[0];
      this.images = this.route.snapshot.data.point.data[1];
      this.transformCoordinatesWGS84(this.point.X_WGS84, this.point.Y_WGS84)
    });
  }

  openPreview(scroll) {
    this.scrollBar = scroll;
  }

  transformCoordinatesWGS84(x, y) {
    const X = x;
    const Y = y;
    if (X) {
      if (Y) {

        if (Y >= this.southernLimitLatitude) {
          if (X >= this.westernLimitLongitude) {
            if (X >= this.startLongitude5WGS84) {
              if (X <= this.startLongitude6WGS84) {

                // 2000 zone 5 (długość od 14.14 do 16.5, szerokość od 50.25 do 54.5)
                if (Y >= this.startLatitude5WGS84 && Y <= this.endLatitude5WGS84) {
                  const coordinate2000 = proj4('EPSG:2176', [X, Y]);
                  this.setCoordinates2000(coordinate2000[0], coordinate2000[1]);

                } else {
                  this.setCoordinates2000(null, null);

                  console.log('Wpisane współrzędne nie są w układzie 2000');
                }
              } else if (X <= this.startLongitude7WGS84) {

                // 2000 zone 6 (długość od 16.5 do 19.5, szerokość od 49.3300 do 54.8300)
                if (Y >= this.startLatitude6WGS84 && Y <= this.endLatitude6WGS84) {
                  const coordinate2000 = proj4('EPSG:2177', [X, Y]);
                  this.setCoordinates2000(coordinate2000[0], coordinate2000[1]);
                } else {
                  this.setCoordinates2000(null, null);
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                }
              } else if (X <= this.startLongitude8WGS84) {

                // 2000 zone 7 (długość od 19.5 do 22.5, szerokość od 49.0900 do 54.5000)
                if (Y >= this.startLatitude7WGS84 && Y <= this.endLatitude7WGS84) {
                  const coordinate2000 = proj4('EPSG:2178', [X, Y]);
                  this.setCoordinates2000(coordinate2000[0], coordinate2000[1]);
                } else {
                  this.setCoordinates2000(null, null);
                  console.log('Wpisane współrzędne nie są w układzie 2000 3');
                }
              } else if (X <= this.endLongitude8WGS84) {

                // 2000 zone 8 (długość od 22.5 do 24.16, szerokość od 49.0300 do 54.4500)
                if (Y >= this.startLatitude8WGS84 && Y <= this.endLatitude8WGS84) {
                  const coordinate2000 = proj4('EPSG:2179', [X, Y]);
                  this.setCoordinates2000(coordinate2000[0], coordinate2000[1]);
                } else {
                  this.setCoordinates2000(null, null);
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                }
              } else {
                this.setCoordinates2000(null, null);
                console.log('Wpisane współrzędne nie są w układze 2000 1');
              }
            } else {
              this.setCoordinates2000(null, null);
              console.log('Wpisane współrzędne nie są w układzie 2000 2');
            }
          }
        }
      }
    }
  }

  setCoordinates2000(x2000, y2000) {
    this.point.X_2000 = x2000;
    this.point.Y_2000 = y2000;
    this.mapService.setChangeCords([this.point.X_WGS84, this.point.Y_WGS84]);
  }
}
