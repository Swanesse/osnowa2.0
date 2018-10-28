import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import proj4 from 'proj4';
import {MapService} from "../../services/map.service";
import * as _ from 'lodash';

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
  validX: string = '13';
  validY: string = '13';
  isXBlur: boolean = false;
  isYBlur: boolean = false;


  constructor(private mapService: MapService,) {
    proj4.defs([
      ['EPSG:2176', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2177', '+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2178', '+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2179', '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs']
    ]);
    // getPickedCords zwraca współrzędne, które kliknęliśmy na mapie
    // zwraca 2 wartości - współrzędne
    this.mapService.getPickedCords().subscribe((cords: Array<number>) => {
      this.transformCoordinatesWGS84Location(cords[0], cords[1]);
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
  }

  transformCoordinatesWGS84() {
    const X = this.pointForm.value.X_WGS84;
    const Y = this.pointForm.value.Y_WGS84;
    console.log('1');
    if (this.pointForm.get('X_WGS84').valid && this.pointForm.get('Y_WGS84').valid) {
      if (Y) {
        console.log('1');
        if (X) {

          if (X >= -90) {
            if (Y >= -180) {
              if (Y >= 14.1400) {
                if (Y <= 16.5000) {

                  // 2000 zone 5
                  if (X >= 50.25 && X <= 54.5) {
                    const coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.set2000(null, null);

                    console.log('Wpisane współrzędne nie są w układzie 2000');
                  }
                } else if (Y <= 19.5000) {

                  // 2000 zone 6
                  if (X >= 49.3300 && X <= 54.8300) {
                    const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.set2000(null, null);
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                  }
                } else if (Y <= 22.5000) {

                  // 2000 zone 7
                  if (X >= 49.0900 && X <= 54.5000) {
                    const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.set2000(null, null);
                    console.log('Wpisane współrzędne nie są w układzie 2000 3');
                  }
                } else if (Y <= 24.1600) {

                  // 2000 zone 8
                  if (X >= 49.0300 && X <= 54.4500) {
                    const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    this.setWGS84AndDisplayPoint(X, Y);
                    this.set2000(null, null);
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                  }
                } else {
                  this.setWGS84AndDisplayPoint(X, Y);
                  this.set2000(null, null);
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              } else {
                this.setWGS84AndDisplayPoint(X, Y);
                this.set2000(null, null);
                console.log('Wpisane współrzędne nie są w układzie 2000 2');
              }
            }
          }
        }
      }
    }
  }

  set2000(x, y) {
    this.pointForm.controls['X_2000'].setValue(x);
    this.pointForm.controls['Y_2000'].setValue(y);
  }

  setWGS84AndDisplayPoint(x, y) {
    this.pointForm.controls['X_WGS84'].setValue(x);
    this.pointForm.controls['Y_WGS84'].setValue(y);
    this.displayPoint();
  }

  displayPoint() {
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


  transformCoordinates2000() {
    const X = this.pointForm.get('X_2000').value;
    const Y = this.pointForm.get('Y_2000').value;

    if (this.pointForm.get('X_2000').valid && this.pointForm.get('Y_2000').valid) {
      if (Y) {
        if (X) {
          if (Y >= 5438667.1168) {
            if (Y <= 5606974.4722) {

              // 2000 zone 5
              if (X >= 5568580.0317 && X <= 6042141.2701) {
                const coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(Y), Number(X)]);
                this.set2000(X, Y);
                this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
              } else {
                this.setWGS84AndDisplayPoint(null, null);
                console.log('Współrzędna Y jest niepoprawna');
              }
            } else if (Y >= 6390979.5111) {
              if (Y <= 6609020.4889) {

                // 2000 zone 6
                if (X >= 5466989.5093 && X <= 6078869.0066) {
                  const coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(Y), Number(X)]);
                  this.set2000(X, Y);
                  this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                } else {
                  this.setWGS84AndDisplayPoint(null, null);
                  console.log('Współrzędna Y jest niepoprawna');
                }

              } else if (Y >= 7390450.4069) {
                if (Y <= 7609549.5931) {

                  // 2000 zone 7
                  if (X >= 5440301.5811 && X <= 6042141.2701) {
                    const coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(Y), Number(X)]);
                    this.set2000(X, Y);
                    this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                  } else {
                    this.setWGS84AndDisplayPoint(null, null);
                    console.log('Współrzędna Y jest niepoprawna');
                  }

                } else if (Y >= 8390318.4332) {
                  if (Y <= 8511699.5509) {

                    // 2000 zone 8
                    if (X >= 5432557.9291 && X <= 6036576.6253) {
                      const coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(Y), Number(X)]);
                      this.set2000(X, Y);
                      this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                    } else {
                      this.setWGS84AndDisplayPoint(null, null);
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  } else {
                    this.setWGS84AndDisplayPoint(null, null);
                    console.log('Współrzędna X jest niepoprawna 1');
                  }
                } else {
                  this.setWGS84AndDisplayPoint(null, null);
                  console.log('Współrzędna X jest niepoprawna 2');
                }
              } else {
                this.setWGS84AndDisplayPoint(null, null);
                console.log('Współrzędna X jest niepoprawna 3');
              }
            } else {
              this.setWGS84AndDisplayPoint(null, null);
              console.log('Współrzędna X jest niepoprawna 4');
            }
          } else {
            this.setWGS84AndDisplayPoint(null, null);
            console.log('Współrzędna X jest niepoprawna 5');
          }
        }
      }
    }
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.location = true;
        this.pointForm.get('X').clearValidators();
        this.pointForm.get('Y').clearValidators();
        this.pointForm.get('X').updateValueAndValidity();
        this.pointForm.get('Y').updateValueAndValidity();
        this.setWGS84AndDisplayPoint(location.coords.latitude, location.coords.longitude);
        this.transformCoordinatesWGS84Location(this.pointForm.get('X_WGS84').value, this.pointForm.get('Y_WGS84').value);
      });
    } else {
      alert('twoja przeglądarka nie wspiera geolokacji...');
    }
  }

  transformCoordinates() {
    const X = this.pointForm.value.X;
    const Y = this.pointForm.value.Y;

    if (this.pointForm.get('X').valid && this.pointForm.get('Y').valid) {
      if (Y) {
        if (X) {

          if (X >= -90) {
            if (Y >= -180) {
              if (Y >= 14.1400) {
                if (Y <= 16.5000) {

                  // 2000 zone 5 (długość od 14.14 do 16.5, szerokość od 50.25 do 54.5)
                  if (X >= 50.25 && X <= 54.5) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.setWGS84AndDisplayPoint(X, Y);
                      console.log('Wpisane współrzędne nie są w układzie 2000');

                    }
                  }
                } else if (Y <= 19.5000) {

                  // 2000 zone 6 (długość od 16.5 do 19.5, szerokość od 49.33 do 54.83)
                  if (X >= 49.3300 && X <= 54.8300) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.setWGS84AndDisplayPoint(X, Y);
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');

                    }
                  }
                } else if (Y <= 22.5000) {

                  // 2000 zone 7 (długość od 19.5 do 22.5, szerokość od 49.09 do 54.50)
                  if (X >= 49.0900 && X <= 54.5000) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna X jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.setWGS84AndDisplayPoint(X, Y);
                      console.log('Wpisane współrzędne nie są w układzie 2000 3');
                    }
                  }

                } else if (Y <= 24.1600) {

                  // 2000 zone 8 (długość od 22.5 do 24,16, szerokość od 49.03 do 54.45)
                  if (X >= 49.0300 && X <= 54.4500) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.set2000(coordinate2000[1], coordinate2000[0]);
                    this.setWGS84AndDisplayPoint(X, Y);
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.setWGS84AndDisplayPoint(X, Y);
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');

                    }
                  }
                } else if (Y >= 5438667.1168) {
                  if (Y <= 5606974.4722) {

                    // 2000 zone 5
                    if (X >= 5568580.0317 && X <= 6042141.2701) {
                      this.validX = '1';
                      this.validY = '1';
                      const coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(Y), Number(X)]);
                      this.set2000(X, Y);
                      this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                    } else {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  } else if (Y >= 6390979.5111) {
                    if (Y <= 6609020.4889) {

                      // 2000 zone 6
                      if (X >= 5466989.5093 && X <= 6078869.0066) {
                        this.validX = '1';
                        this.validY = '1';
                        const coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(Y), Number(X)]);
                        this.set2000(X, Y);
                        this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                      } else {
                        this.validY = '0';
                        console.log('Współrzędna Y jest niepoprawna');
                      }

                    } else if (Y >= 7390450.4069) {
                      if (Y <= 7609549.5931) {

                        // 2000 zone 7
                        if (X >= 5440301.5811 && X <= 6042141.2701) {
                          this.validX = '1';
                          this.validY = '1';
                          const coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(Y), Number(X)]);
                          this.set2000(X, Y);
                          this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                        } else {
                          this.validY = '0';
                          console.log('Współrzędna Y jest niepoprawna');
                        }

                      } else if (Y >= 8390318.4332) {
                        if (Y <= 8511699.5509) {

                          // 2000 zone 8
                          if (X >= 5432557.9291 && X <= 6036576.6253) {
                            this.validX = '1';
                            this.validY = '1';
                            const coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(Y), Number(X)]);
                            this.set2000(X, Y);
                            this.setWGS84AndDisplayPoint(coordinateWGS84[1], coordinateWGS84[0]);
                          } else {
                            this.validY = '0';
                            console.log('Współrzędna Y jest niepoprawna');
                          }
                        } else {
                          this.validX = '0';
                          console.log('Współrzędna X jest niepoprawna 1');
                        }
                      } else {
                        this.validX = '0';
                        console.log('Współrzędna X jest niepoprawna 2');
                      }
                    } else {
                      this.validX = '0';
                      console.log('Współrzędna X jest niepoprawna 3');
                    }
                  } else {
                    this.validX = '0';
                    console.log('Współrzędna X jest niepoprawna 4');
                  }
                } else if (X > 180) {
                  this.validX = '0';
                  console.log('Współrzędna X jest niepoprawna 5');
                } else {
                  this.validX = '1';
                  this.validY = '1';
                  this.setWGS84AndDisplayPoint(X, Y);
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              } else {
                this.validX = '1';
                this.validY = '1';
                this.setWGS84AndDisplayPoint(X, Y);
                console.log('Wpisane współrzędne nie są w układzie 2000 2');
              }
            } else {
              this.validX = '0';
              console.log('Współrzędna X jest niepoprawna');
            }
          } else {
            this.validY = '0';
            console.log('Współrzędna Y jest niepoprawna');
          }
        }
      }
    }
  }

  transformCoordinatesWGS84Location(x, y) {
    const X = x;
    const Y = y;
    if (Y) {
      if (X) {

        if (X >= -90) {
          if (Y >= -180) {
            if (Y >= 14.1400) {
              if (Y <= 16.5000) {

                // 2000 zone 5
                if (X >= 50.25 && X <= 54.5) {
                  const coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                  this.set2000(coordinate2000[1], coordinate2000[0]);
                  this.setWGS84AndDisplayPoint(X, Y);
                } else {
                  this.setWGS84AndDisplayPoint(X, Y);
                  this.set2000(null, null);
                  console.log('Wpisane współrzędne nie są w układzie 2000');
                }
              } else if (Y <= 19.5000) {

                // 2000 zone 6
                if (X >= 49.3300 && X <= 54.8300) {
                  const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                  this.set2000(coordinate2000[1], coordinate2000[0]);
                  this.setWGS84AndDisplayPoint(X, Y);
                } else {
                  this.setWGS84AndDisplayPoint(X, Y);
                  this.set2000(null, null);
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                }
              } else if (Y <= 22.5000) {

                // 2000 zone 7
                if (X >= 49.0900 && X <= 54.5000) {
                  const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                  this.set2000(coordinate2000[1], coordinate2000[0]);
                  this.setWGS84AndDisplayPoint(X, Y);
                } else {
                  this.setWGS84AndDisplayPoint(X, Y);
                  this.set2000(null, null);
                  console.log('Wpisane współrzędne nie są w układzie 2000 3');
                }
              } else if (Y <= 24.1600) {

                // 2000 zone 8
                if (X >= 49.0300 && X <= 54.4500) {
                  const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                  this.set2000(coordinate2000[1], coordinate2000[0]);
                  this.setWGS84AndDisplayPoint(X, Y);
                } else {
                  this.setWGS84AndDisplayPoint(X, Y);
                  this.set2000(null, null);
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                }
              } else {
                this.setWGS84AndDisplayPoint(X, Y);
                this.set2000(null, null);
                console.log('Wpisane współrzędne nie są w układze 2000 1');
              }
            } else {
              this.setWGS84AndDisplayPoint(X, Y);
              this.set2000(null, null);
              console.log('Wpisane współrzędne nie są w układzie 2000 2');
            }
          }
        }
      }
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
