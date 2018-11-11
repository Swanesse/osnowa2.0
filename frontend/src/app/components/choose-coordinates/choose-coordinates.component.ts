import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import proj4 from 'proj4';
import {MapService} from "../../services/map.service";
import * as _ from 'lodash';
import {NotificationsService} from "angular2-notifications";

@Component({
  selector: 'app-choose-coordinates',
  templateUrl: './choose-coordinates.component.html',
  styleUrls: ['./choose-coordinates.component.scss']
})
export class ChooseCoordinatesComponent implements OnInit {

  @Input() pointForm: FormGroup;
  @Input() addPoint: boolean;
  faInfo = faInfoCircle;
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  @Output()
  changePickMode = new EventEmitter();
  pickMode: boolean = false;
  location: boolean = false;
  validY: string = '13';
  validX: string = '13';
  isXBlur: boolean = false;
  isYBlur: boolean = false;

  southernLimitLatitude = -90;
  northernLimitLatitude = 90;
  westernLimitLongitude = -180;
  easternLimitLongitude = 180;

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

  startLongitudeEPSG2176 = 5438667.1168;
  endLongitudeEPSG2176 = 5606974.4722;
  startLongitudeEPSG2177 = 6390979.5111;
  endLongitudeEPSG2177 = 6609020.4889;
  startLongitudeEPSG2178 = 7390450.4069;
  endLongitudeEPSG2178 = 7609549.5931;
  startLongitudeEPSG2179 = 8390318.4332;
  endLongitudeEPSG2179 = 8511699.5509;

  startLatitudeEPSG2176 = 5568580.0317;
  endLatitudeEPSG2176 = 6042141.2701;
  startLatitudeEPSG2177 = 5466989.5093;
  endLatitudeEPSG2177 = 6078869.0066;
  startLatitudeEPSG2178 = 5440301.5811;
  endLatitudeEPSG2178 = 6042141.2701;
  startLatitudeEPSG2179 = 5432557.9291;
  endLatitudeEPSG2179 = 6036576.6253;

  constructor(private mapService: MapService,
              private _notificationsService: NotificationsService,) {
    proj4.defs([
      ['EPSG:2176', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2177', '+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2178', '+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2179', '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs']
    ]);
    // getPickedCords zwraca współrzędne, które kliknęliśmy na mapie
    // zwraca 2 wartości - współrzędne
    this.mapService.getPickedCords().subscribe((cords: Array<number>) => {
      this.transformCoordinatesWGS84(cords[0], cords[1]);
      this.pickMode = false;
      this.changePickMode.emit(this.pickMode);
      this.location = true;
      this.pointForm.get('X').clearValidators();
      this.pointForm.get('Y').clearValidators();
      this.pointForm.get('X').updateValueAndValidity();
      this.pointForm.get('Y').updateValueAndValidity();
    });

  }

  ngOnInit() {
    if (this.addPoint === false) {
      this.transformCoordinatesWGS84(this.pointForm.get('X_WGS84').value, this.pointForm.get('Y_WGS84').value);
    }
  }

  public options = {
    timeOut: 3000,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    pauseOnHover: true,
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  };

  alertInvalidY() {
    this._notificationsService.error('Uwaga', 'Podana szerokość jest niepoprawna');
  }

  alertInvalidX() {
    this._notificationsService.error('Uwaga', 'Podana długość jest niepoprawna');
  }

  alertNot2000(){
    this._notificationsService.warn('Uwaga', 'Wpisane współrzędne nie są w układze 2000');
  }

  transformCoordinates() {
    const X = this.pointForm.get('X').value;
    const Y = this.pointForm.get('Y').value;


    if (X) {
      if (Y) {

        if (Y >= this.southernLimitLatitude) {
          if (X >= this.westernLimitLongitude) {
            if (X >= this.startLongitude5WGS84) {
              if (X <= this.startLongitude6WGS84) {

                // 2000 zone 5 (długość od 14.14 do 16.5, szerokość od 50.25 do 54.5)
                if (Y >= this.startLatitude5WGS84 && Y <= this.endLatitude5WGS84) {
                  this.validX = '1';
                  this.validY = '1';
                  const coordinate2000 = proj4('EPSG:2176', [X, Y]);
                  this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                } else {
                  if (Y > this.northernLimitLatitude) {
                    this.validX = '0';
                    this.alertInvalidY();
                  } else {
                    this.validY = '1';
                    this.validX = '1';
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.alertNot2000();
                  }
                }
              } else if (X <= this.startLongitude7WGS84) {

                // 2000 zone 6 (długość od 16.5 do 19.5, szerokość od 49.3300 do 54.8300)
                if (Y >= this.startLatitude6WGS84 && Y <= this.endLatitude6WGS84) {
                  this.validY = '1';
                  this.validX = '1';
                  const coordinate2000 = proj4('EPSG:2177', [X, Y]);
                  this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                } else {
                  if (Y > this.northernLimitLatitude) {
                    this.validX = '0';
                    this.alertInvalidY();
                  } else {
                    this.validY = '1';
                    this.validX = '1';
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.alertNot2000();
                  }
                }
              } else if (X <= this.startLongitude8WGS84) {

                // 2000 zone 7 (długość od 19.5 do 22.5, szerokość od 49.0900 do 54.5000)
                if (Y >= this.startLatitude7WGS84 && Y <= this.endLatitude7WGS84) {
                  this.validY = '1';
                  this.validX = '1';
                  const coordinate2000 = proj4('EPSG:2178', [X, Y]);
                  this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                } else {
                  if (Y > this.northernLimitLatitude) {
                    this.validX = '0';
                    this.alertInvalidY();
                  } else {
                    this.validY = '1';
                    this.validX = '1';
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.alertNot2000();
                  }
                }

              } else if (X <= this.endLongitude8WGS84) {

                // 2000 zone 8 (długość od 22.5 do 24.16, szerokość od 49.0300 do 54.4500)
                if (Y >= this.startLatitude8WGS84 && Y <= this.endLatitude8WGS84) {
                  this.validY = '1';
                  this.validX = '1';
                  const coordinate2000 = proj4('EPSG:2179', [X, Y]);
                  this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                } else {
                  if (Y > this.northernLimitLatitude) {
                    this.validX = '0';
                    this.alertInvalidY();
                  } else {
                    this.validY = '1';
                    this.validX = '1';
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.alertNot2000();
                  }
                }
              } else if (X >= this.startLongitudeEPSG2176) {
                if (X <= this.endLongitudeEPSG2176) {

                  // 2000 zone 5 (długość od 5438667.1168 do 5606974.4722, szerokość od 5568580.0317 do 6042141.2701)
                  if (Y >= this.startLatitudeEPSG2176 && Y <= this.endLatitudeEPSG2176) {
                    this.validY = '1';
                    this.validX = '1';
                    const coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [X, Y]);
                    this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                  } else {
                    this.validX = '0';
                    this.alertInvalidY();
                  }
                } else if (X >= this.startLongitudeEPSG2177) {
                  if (X <= this.endLongitudeEPSG2177) {

                    // 2000 zone 6 (długość od 6390979.5111 do 6609020.4889, szerokość od 5466989.5093 do 6078869.0066)
                    if (Y >= this.startLatitudeEPSG2177 && Y <= this.endLatitudeEPSG2177) {
                      this.validY = '1';
                      this.validX = '1';
                      const coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [X, Y]);
                      this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                    } else {
                      this.validX = '0';
                      this.alertInvalidY();
                    }

                  } else if (X >= this.startLongitudeEPSG2178) {
                    if (X <= this.endLongitudeEPSG2178) {

                      // 2000 zone 7 (długość od 7390450.4069 do 7609549.5931, szerokość od 5440301.5811 do 6042141.2701)
                      if (Y >= this.startLatitudeEPSG2178 && Y <= this.endLatitudeEPSG2178) {
                        this.validY = '1';
                        this.validX = '1';
                        const coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [X, Y]);
                        this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                      } else {
                        this.validX = '0';
                        this.alertInvalidY();
                      }

                    } else if (X >= this.startLongitudeEPSG2179) {
                      if (X <= this.endLongitudeEPSG2179) {

                        // 2000 zone 8 (długość od 8390318.4332 do 8511699.5509, szerokość od 5432557.9291 do 6036576.6253)
                        if (Y >= this.startLatitudeEPSG2179 && Y <= this.endLatitudeEPSG2179) {
                          this.validY = '1';
                          this.validX = '1';
                          const coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [X, Y]);
                          this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                        } else {
                          this.validX = '0';
                          this.alertInvalidY();
                        }
                      } else {
                        this.validY = '0';
                        this.alertInvalidX();
                      }
                    } else {
                      this.validY = '0';
                      this.alertInvalidX();
                    }
                  } else {
                    this.validY = '0';
                    this.alertInvalidX();
                  }
                } else {
                  this.validY = '0';
                  this.alertInvalidX();
                }
              } else if (Y > this.easternLimitLongitude) {
                this.validY = '0';
                this.alertInvalidX();

              } else {
                this.validY = '1';
                this.validX = '1';
                this.setWGS84AndDisplayPoint(X, Y);
                this.alertNot2000();
              }
            } else {
              this.validY = '1';
              this.validX = '1';
              this.setWGS84AndDisplayPoint(X, Y);
              this.alertNot2000();
            }
          } else {
            this.validY = '0';
            this.alertInvalidX();
          }
        } else {
          this.validX = '0';
          this.alertInvalidY();
        }
      }
    }
  }

  transformCoordinatesWGS84(x, y) {
    const X = x;
    const Y = y;
    if ((!this.pointForm.get('X_WGS84').dirty && !this.pointForm.get('Y_WGS84').dirty) || (this.pointForm.get('X_WGS84').valid && this.pointForm.get('Y_WGS84').valid)) {
      if (X) {
        if (Y) {

          if (Y >= this.southernLimitLatitude) {
            if (X >= this.westernLimitLongitude) {
              if (X >= this.startLongitude5WGS84) {
                if (X <= this.startLongitude6WGS84) {

                  // 2000 zone 5 (długość od 14.14 do 16.5, szerokość od 50.25 do 54.5)
                  if (Y >= this.startLatitude5WGS84 && Y <= this.endLatitude5WGS84) {
                    const coordinate2000 = proj4('EPSG:2176', [X, Y]);
                    this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);

                  } else {
                    this.setCoordinates(null, null, X, Y);

                    this.alertNot2000();
                  }
                } else if (X <= this.startLongitude7WGS84) {

                  // 2000 zone 6 (długość od 16.5 do 19.5, szerokość od 49.3300 do 54.8300)
                  if (Y >= this.startLatitude6WGS84 && Y <= this.endLatitude6WGS84) {
                    const coordinate2000 = proj4('EPSG:2177', [X, Y]);
                    this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                  } else {
                    this.setCoordinates(null, null, X, Y);
                    this.alertNot2000();
                  }
                } else if (X <= this.startLongitude8WGS84) {

                  // 2000 zone 7 (długość od 19.5 do 22.5, szerokość od 49.0900 do 54.5000)
                  if (Y >= this.startLatitude7WGS84 && Y <= this.endLatitude7WGS84) {
                    const coordinate2000 = proj4('EPSG:2178', [X, Y]);
                    this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                  } else {
                    this.setCoordinates(null, null, X, Y);
                    this.alertNot2000();
                  }
                } else if (X <= this.endLongitude8WGS84) {

                  // 2000 zone 8 (długość od 22.5 do 24.16, szerokość od 49.0300 do 54.4500)
                  if (Y >= this.startLatitude8WGS84 && Y <= this.endLatitude8WGS84) {
                    const coordinate2000 = proj4('EPSG:2179', [X, Y]);
                    this.setCoordinates(coordinate2000[0], coordinate2000[1], X, Y);
                  } else {
                    this.setCoordinates(null, null, X, Y);
                    this.alertNot2000();
                  }
                } else {
                  this.setCoordinates(null, null, X, Y);
                  this.alertNot2000();
                }
              } else {
                this.setCoordinates(null, null, X, Y);
                this.alertNot2000();
              }
            }
          }
        }
      }
    }
  }

  transformCoordinates2000() {
    const X = this.pointForm.get('X_2000').value;
    const Y = this.pointForm.get('Y_2000').value;

    if (this.pointForm.get('X_2000').valid && this.pointForm.get('Y_2000').valid) {
      if (X) {
        if (Y) {
          if (X >= this.startLongitudeEPSG2176) {
            if (X <= this.endLongitudeEPSG2176) {

              // 2000 zone 5 (długość od 5438667.1168 do 5606974.4722, szerokość od 5568580.0317 do 6042141.2701)
              if (Y >= this.startLatitudeEPSG2176 && Y <= this.endLatitudeEPSG2176) {
                const coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [X, Y]);
                this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
              } else {
                this.setWGS84AndDisplayPoint(null, null);
                this.alertInvalidY();
              }
            } else if (X >= this.startLongitudeEPSG2177) {
              if (X <= this.endLongitudeEPSG2177) {

                // 2000 zone 6 (długość od 6390979.5111 do 6609020.4889, szerokość od 5466989.5093 do 6078869.0066)
                if (Y >= this.startLatitudeEPSG2177 && Y <= this.endLatitudeEPSG2177) {
                  const coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [X, Y]);
                  this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                } else {
                  this.setWGS84AndDisplayPoint(null, null);
                  this.alertInvalidY();
                }

              } else if (X >= this.startLongitudeEPSG2178) {
                if (X <= this.endLongitudeEPSG2178) {

                  // 2000 zone 7 (długość od 7390450.4069 do 7609549.5931, szerokość od 5440301.5811 do 6042141.2701)
                  if (Y >= this.startLatitudeEPSG2178 && Y <= this.endLatitudeEPSG2178) {
                    const coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [X, Y]);
                    this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                  } else {
                    this.setWGS84AndDisplayPoint(null, null);
                    this.alertInvalidY();
                  }

                } else if (X >= this.startLongitudeEPSG2179) {
                  if (X <= this.endLongitudeEPSG2179) {

                    // 2000 zone 8 (długość od 8390318.4332 do 8511699.5509, szerokość od 5432557.9291 do 6036576.6253)
                    if (Y >= this.startLatitudeEPSG2179 && Y <= this.endLatitudeEPSG2179) {
                      const coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [X, Y]);
                      this.setCoordinates(X, Y, coordinateWGS84[0], coordinateWGS84[1]);
                    } else {
                      this.setWGS84AndDisplayPoint(null, null);
                      this.alertInvalidY();
                    }
                  } else {
                    this.setWGS84AndDisplayPoint(null, null);
                    this.alertInvalidX();
                  }
                } else {
                  this.setWGS84AndDisplayPoint(null, null);
                  this.alertInvalidX();
                }
              } else {
                this.setWGS84AndDisplayPoint(null, null);
                this.alertInvalidX();
              }
            } else {
              this.setWGS84AndDisplayPoint(null, null);
              this.alertInvalidX();
            }
          } else {
            this.setWGS84AndDisplayPoint(null, null);
            this.alertInvalidX();
          }
        }
      }
    }
  }

  setCoordinates(x2000, y2000, xWGS84, yWGS84) {
    this.pointForm.controls['X_2000'].setValue(x2000);
    this.pointForm.controls['Y_2000'].setValue(y2000);
    this.setWGS84AndDisplayPoint(xWGS84, yWGS84);
  }

  setWGS84AndDisplayPoint(xWGS84, yWGS84) {
    this.pointForm.controls['X_WGS84'].setValue(xWGS84);
    this.pointForm.controls['Y_WGS84'].setValue(yWGS84);
    this.displayPoint();
  }

  displayPoint() {

    // if (this.pointForm.controls['controlType'].value === 'pozioma' && (this.pointForm.controls['controlClass'].value === '1' || this.pointForm.controls['controlClass'].value === '2')) {
    //   this.pointIcon = 'assets/podstawowa_pozioma.png';
    // } else if (this.pointForm.controls['controlType'].value === 'wysokosciowa' && (this.pointForm.controls['controlClass'].value === '1' || this.pointForm.controls['controlClass'].value === '2')) {
    //   this.pointIcon = 'assets/podstawowa_wysokosciowa.png';
    // } else if (this.pointForm.controls['controlType'].value === 'dwufunkcyjna' && (this.pointForm.controls['controlClass'].value === '1' || this.pointForm.controls['controlClass'].value === '2')) {
    //   this.pointIcon = 'assets/podstawowa_xyh.png';
    // } else if (this.pointForm.controls['controlType'].value === 'pozioma' && this.pointForm.controls['controlClass'].value === '3') {
    //   this.pointIcon = 'assets/szczegolowa_pozioma.png';
    // } else if (this.pointForm.controls['controlType'].value === 'wysokosciowa' && this.pointForm.controls['controlClass'].value === '3') {
    //   this.pointIcon = 'assets/szczegolowa_wysokosciowa.png';
    // } else if (this.pointForm.controls['controlType'].value === 'dwufunkcyjna' && this.pointForm.controls['controlClass'].value === '3') {
    //   this.pointIcon = 'assets/szczegolowa_xyh.png';
    // } else {
    //   this.pointIcon = 'assets/point.jpg';
    // }

    const cords: Array<number> = [this.pointForm.get('X_WGS84').value, this.pointForm.get('Y_WGS84').value];
    // Zwraca adres(kraj, województwo...) ze współrzędnych.
    this.getAddress(cords);
    this.mapService.setChangeCords(cords);
  }

  getAddress(latlong) {
    this.mapService.getPost(latlong).subscribe(
      posts => {
        if (!_.has(posts, 'error')) {
          this.pointForm.controls['country'].setValue(posts.address.country);
          this.pointForm.controls['state'].setValue(posts.address.state);

          const districtSplit = String(posts.display_name).split(',');
          if (posts.address.postcode) {
            this.pointForm.controls['district'].setValue(districtSplit[districtSplit.length - 4]);
          } else {
            this.pointForm.controls['district'].setValue(districtSplit[districtSplit.length - 3]);
          }
          this.pointForm.controls['county'].setValue(posts.address.county);

          if (posts.address.city) {
            this.pointForm.controls['locality'].setValue(posts.address.city);
          } else if (posts.address.town) {
            this.pointForm.controls['locality'].setValue(posts.address.town);
          } else {
            this.pointForm.controls['locality'].setValue(posts.address.village);
          }

          this.pointForm.controls['city_district'].setValue(posts.address.city_district);

          this.pointForm.controls['road'].setValue(posts.address.road);
          this.pointForm.controls['house_number'].setValue(posts.address.house_number);
        }
        else {
          this.pointForm.controls['country'].setValue(null);
          this.pointForm.controls['state'].setValue(null);
          this.pointForm.controls['district'].setValue(null);
          this.pointForm.controls['county'].setValue(null);
          this.pointForm.controls['locality'].setValue(null);
          this.pointForm.controls['city_district'].setValue(null);
          this.pointForm.controls['road'].setValue(null);
          this.pointForm.controls['house_number'].setValue(null);
        }
      });
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.location = true;
        this.pointForm.get('X').clearValidators();
        this.pointForm.get('Y').clearValidators();
        this.pointForm.get('X').updateValueAndValidity();
        this.pointForm.get('Y').updateValueAndValidity();
        this.transformCoordinatesWGS84(location.coords.longitude, location.coords.latitude);
      });
    } else {
      alert('twoja przeglądarka nie wspiera geolokacji...');
    }
  }

  chooseCoordinatesFromMap() {
    // Przesyła do mapy informację, że jesteśmy w trybie wyboru punktu na mapie.
    // Zmieni się kursor z łapki na krzyżyk
    this.pickMode = true;
    this.changePickMode.emit(this.pickMode);

    this.mapService.enablePickMode();
  }

  ifXisBlur() {
    this.isXBlur = true;
  }

  ifYisBlur() {
    this.isYBlur = true;
  }

  outputCoordinateX() {
    this.isXBlur = false;
  }

  outputCoordinateY() {
    this.isYBlur = false;
  }
}
