import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {PointDetails} from '../../models/PointDetails';
import proj4 from 'proj4';
import {MapService} from '../../services/map.service';

// import {HttpService} from '../../services/http.service';

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit, OnDestroy {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  checked: boolean = true;
  isAddPanel: boolean = true;
  location = false;
  sub;
  X;
  Y;
  X_2000;
  Y_2000;
  point = new PointDetails();
  validX: string = '13';
  validY: string = '13';
  isXBlur: boolean = false;
  isYBlur: boolean = false;
  pointForm: FormGroup;
  stabilizationWays = ['bolec', 'pal drewniany', 'kamień naturalny', 'pręt', 'rurka', 'słupek betonowy', 'szczegół terenowy', 'inny'];
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  constructor(private _mapService: MapService, private cdr: ChangeDetectorRef) {
    proj4.defs([
      ['EPSG:2176', '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2177', '+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2178', '+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs'],
      ['EPSG:2179', '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs']
    ]);
    this.sub = this._mapService.listen().subscribe((m: any) => {
      this.point.X_WGS84 = m[1];
      this.point.Y_WGS84 = m[2];
      this.transformCoordinatesWGS84Location(this.point.X_WGS84, this.point.Y_WGS84);
      this.isAddPanel = m[0];
      this.location = true;
      this.cdr.detectChanges();
    });
  }

  getPosts(latlong) {
    this._mapService.getPost(latlong).subscribe(posts => {
      this.point.country = posts.address.country;
      this.point.state = posts.address.state;

      const districtSplit = String(posts.display_name).split(',');
      if (posts.address.postcode) {
        this.point.district = districtSplit[districtSplit.length - 4];
      } else {
        this.point.district = districtSplit[districtSplit.length - 3];
      }
      this.point.county = posts.address.county;

      if (posts.address.city) {
        this.point.locality = posts.address.city;
      } else if (posts.address.town) {
        this.point.locality = posts.address.town;
      } else {
        this.point.locality = posts.address.village;
      }

      this.point.city_district = posts.address.city_district;


      this.point.road = posts.address.road;
      this.point.house_number = posts.address.house_number;
      console.log('post: ', posts);
    });
  }

  ngOnInit() {

    this.pointForm = new FormGroup({
      X: new FormControl(null, [Validators.required, this.ValidatorX]),
      Y: new FormControl(null, [Validators.required, this.ValidatorY]),

      X_WGS84: new FormControl(null, [Validators.required, this.ValidatorXWGS84]),
      Y_WGS84: new FormControl(null, [Validators.required, this.ValidatorYWGS84]),

      X_2000: new FormControl(null, this.ValidatorX2000),
      Y_2000: new FormControl(null, this.ValidatorY2000),

      X_local: new FormControl(null),
      Y_local: new FormControl(null),

      controlType: new FormControl(null),
      controlClass: new FormControl(null),
      id: new FormControl(null),

      hAmsterdam: new FormControl(null),
      hKronsztadt: new FormControl(null),

      country: new FormControl(null),
      state: new FormControl(null),
      district: new FormControl(null),
      county: new FormControl(null),

      locality: new FormControl(null),
      city_district: new FormControl(null),
      road: new FormControl(null),
      house_number: new FormControl(null),

      stabilization: new FormControl(null),
      found: new FormControl(null),
    });
  }

  ifXisBlur() {
    this.isXBlur = true;
  }

  ifYisBlur() {
    this.isYBlur = true;

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

                  // 2000 zone 5
                  if (X >= 50.25 && X <= 54.5) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      this.displayPoint();
                      console.log('Wpisane współrzędne nie są w układzie 2000');

                    }
                  }
                } else if (Y <= 19.5000) {

                  // 2000 zone 6
                  if (X >= 49.3300 && X <= 54.8300) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      this.displayPoint();
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');

                    }
                  }
                } else if (Y <= 22.5000) {

                  // 2000 zone 7
                  if (X >= 49.0900 && X <= 54.5000) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                    // this.getPosts(this.point.X_WGS84, this.point.Y_WGS84 );
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna X jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      this.displayPoint();
                      console.log('Wpisane współrzędne nie są w układzie 2000 3');
                    }
                  }

                } else if (Y <= 24.1600) {

                  // 2000 zone 8
                  if (X >= 49.0300 && X <= 54.4500) {
                    this.validX = '1';
                    this.validY = '1';
                    const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    } else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      this.displayPoint();
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
                      this.X_2000 = X;
                      this.Y_2000 = Y;
                      this.point.X_WGS84 = coordinateWGS84[1];
                      this.point.Y_WGS84 = coordinateWGS84[0];
                      this.displayPoint();
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
                        this.X_2000 = X;
                        this.Y_2000 = Y;
                        this.point.X_WGS84 = coordinateWGS84[1];
                        this.point.Y_WGS84 = coordinateWGS84[0];
                        this.displayPoint();
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
                          this.X_2000 = X;
                          this.Y_2000 = Y;
                          this.point.X_WGS84 = coordinateWGS84[1];
                          this.point.Y_WGS84 = coordinateWGS84[0];
                          this.displayPoint();
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
                            this.X_2000 = X;
                            this.Y_2000 = Y;
                            this.point.X_WGS84 = coordinateWGS84[1];
                            this.point.Y_WGS84 = coordinateWGS84[0];
                            this.displayPoint();
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
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              } else {
                this.validX = '1';
                this.validY = '1';
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
                this.displayPoint();
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

  transformCoordinatesWGS84() {
    const X = this.pointForm.value.X_WGS84;
    const Y = this.pointForm.value.Y_WGS84;

    if (this.pointForm.get('X_WGS84').valid && this.pointForm.get('Y_WGS84').valid) {
      if (Y) {
        if (X) {

          if (X >= -90) {
            if (Y >= -180) {
              if (Y >= 14.1400) {
                if (Y <= 16.5000) {

                  // 2000 zone 5
                  if (X >= 50.25 && X <= 54.5) {
                    const coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w układzie 2000');
                  }
                } else if (Y <= 19.5000) {

                  // 2000 zone 6
                  if (X >= 49.3300 && X <= 54.8300) {
                    const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                  }
                } else if (Y <= 22.5000) {

                  // 2000 zone 7
                  if (X >= 49.0900 && X <= 54.5000) {
                    const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w układzie 2000 3');
                  }
                } else if (Y <= 24.1600) {

                  // 2000 zone 8
                  if (X >= 49.0300 && X <= 54.4500) {
                    const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                  } else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.displayPoint();
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                  }
                } else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              } else {
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
                this.displayPoint();
                this.X_2000 = null;
                this.Y_2000 = null;
                console.log('Wpisane współrzędne nie są w układzie 2000 2');
              }
            }
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
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                } else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układzie 2000');
                }
              } else if (Y <= 19.5000) {

                // 2000 zone 6
                if (X >= 49.3300 && X <= 54.8300) {
                  const coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                } else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                }
              } else if (Y <= 22.5000) {

                // 2000 zone 7
                if (X >= 49.0900 && X <= 54.5000) {
                  const coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                } else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układzie 2000 3');
                }
              } else if (Y <= 24.1600) {

                // 2000 zone 8
                if (X >= 49.0300 && X <= 54.4500) {
                  const coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                } else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.displayPoint();
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                }
              } else {
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
                this.displayPoint();
                this.X_2000 = null;
                this.Y_2000 = null;
                console.log('Wpisane współrzędne nie są w układze 2000 1');
              }
            } else {
              this.point.X_WGS84 = X;
              this.point.Y_WGS84 = Y;
              this.displayPoint();
              this.X_2000 = null;
              this.Y_2000 = null;
              console.log('Wpisane współrzędne nie są w układzie 2000 2');
            }
          }
        }
      }
    }
  }


  transformCoordinates2000() {
    const X = this.pointForm.value.X_2000;
    const Y = this.pointForm.value.Y_2000;

    if (this.pointForm.get('X_2000').valid && this.pointForm.get('Y_2000').valid) {
      if (Y) {
        if (X) {
          if (Y >= 5438667.1168) {
            if (Y <= 5606974.4722) {

              // 2000 zone 5
              if (X >= 5568580.0317 && X <= 6042141.2701) {
                const coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(Y), Number(X)]);
                this.X_2000 = X;
                this.Y_2000 = Y;
                this.point.X_WGS84 = coordinateWGS84[1];
                this.point.Y_WGS84 = coordinateWGS84[0];
                this.displayPoint();
              } else {
                this.point.X_WGS84 = null;
                this.point.Y_WGS84 = null;
                this.displayPoint();
                console.log('Współrzędna Y jest niepoprawna');
              }
            } else if (Y >= 6390979.5111) {
              if (Y <= 6609020.4889) {

                // 2000 zone 6
                if (X >= 5466989.5093 && X <= 6078869.0066) {
                  const coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(Y), Number(X)]);
                  this.X_2000 = X;
                  this.Y_2000 = Y;
                  this.point.X_WGS84 = coordinateWGS84[1];
                  this.point.Y_WGS84 = coordinateWGS84[0];
                  this.displayPoint();
                } else {
                  this.point.X_WGS84 = null;
                  this.point.Y_WGS84 = null;
                  this.displayPoint();
                  console.log('Współrzędna Y jest niepoprawna');
                }

              } else if (Y >= 7390450.4069) {
                if (Y <= 7609549.5931) {

                  // 2000 zone 7
                  if (X >= 5440301.5811 && X <= 6042141.2701) {
                    const coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(Y), Number(X)]);
                    this.X_2000 = X;
                    this.Y_2000 = Y;
                    this.point.X_WGS84 = coordinateWGS84[1];
                    this.point.Y_WGS84 = coordinateWGS84[0];
                    this.displayPoint();
                  } else {
                    this.point.X_WGS84 = null;
                    this.point.Y_WGS84 = null;
                    this.displayPoint();
                    console.log('Współrzędna Y jest niepoprawna');
                  }

                } else if (Y >= 8390318.4332) {
                  if (Y <= 8511699.5509) {

                    // 2000 zone 8
                    if (X >= 5432557.9291 && X <= 6036576.6253) {
                      const coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(Y), Number(X)]);
                      this.X_2000 = X;
                      this.Y_2000 = Y;
                      this.point.X_WGS84 = coordinateWGS84[1];
                      this.point.Y_WGS84 = coordinateWGS84[0];
                      this.displayPoint();
                    } else {
                      this.point.X_WGS84 = null;
                      this.point.Y_WGS84 = null;
                      this.displayPoint();
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  } else {
                    this.point.X_WGS84 = null;
                    this.point.Y_WGS84 = null;
                    this.displayPoint();
                    console.log('Współrzędna X jest niepoprawna 1');
                  }
                } else {
                  this.point.X_WGS84 = null;
                  this.point.Y_WGS84 = null;
                  this.displayPoint();
                  console.log('Współrzędna X jest niepoprawna 2');
                }
              } else {
                this.point.X_WGS84 = null;
                this.point.Y_WGS84 = null;
                this.displayPoint();
                console.log('Współrzędna X jest niepoprawna 3');
              }
            } else {
              this.point.X_WGS84 = null;
              this.point.Y_WGS84 = null;
              this.displayPoint();
              console.log('Współrzędna X jest niepoprawna 4');
            }
          } else {
            this.point.X_WGS84 = null;
            this.point.Y_WGS84 = null;
            this.displayPoint();
            console.log('Współrzędna X jest niepoprawna 5');
          }
        }
      }
    }
  }

  outputCoordinateX() {
    this.isXBlur = false;
  }

  outputCoordinateY() {
    this.isYBlur = false;
  }

  ValidatorY(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -180 || (y > 180 && y < 5438667.1168) || (y > 5606974.4722 && y < 6390979.5111) || (y > 6609020.4889 && y < 7390450.4069) || (y > 7609549.5931 && y < 8390318.4332) || y > 8511699.5509) {
      return {unproper: true};
    }
  }

  ValidatorX(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -90 || (x > 90 && x < 5432557.9291) || (x > 6078869.0066)) {
      return {unproper: true};
    }
  }

  ValidatorYWGS84(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -180 || y > 180) {
      return {unproper: true};
    }
  }

  ValidatorXWGS84(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -90 || x > 90) {
      return {unproper: true};
    }
  }

  ValidatorY2000(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < 5438667.1168 || (y > 5606974.4722 && y < 6390979.5111) || (y > 6609020.4889 && y < 7390450.4069) || (y > 7609549.5931 && y < 8390318.4332) || y > 8511699.5509) {
      return {unproper: true};
    }
  }

  ValidatorX2000(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < 5432557.9291 || x > 6078869.0066) {
      return {unproper: true};
    }
  }

  getCoordinates() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.location = true;
        this.point.X_WGS84 = location.coords.latitude;
        this.point.Y_WGS84 = location.coords.longitude;
        this.transformCoordinatesWGS84Location(this.point.X_WGS84, this.point.Y_WGS84);
      });
    } else {
      alert('twoja przeglądarka nie wspiera geolokacji...');
    }
  }

  chooseCoordinatesFromMap() {
    this.isAddPanel = false;
    this._mapService.filter3(this.isAddPanel);
  }

  onSubmit() {

    this.point.X_WGS84 = this.pointForm.value.X_WGS84;
    this.point.Y_WGS84 = this.pointForm.value.Y_WGS84;
    this.point.X_local = this.pointForm.value.X_local;
    this.point.Y_local = this.pointForm.value.Y_local;

    this.point.controlType = this.pointForm.value.controlType;
    this.point.controlClass = this.pointForm.value.controlClass;
    this.point.id = this.pointForm.value.id;

    this.point.hAmsterdam = this.pointForm.value.hAmsterdam;
    this.point.hKronsztadt = this.pointForm.value.hKronsztadt;

    this.point.country = this.pointForm.value.country;
    this.point.state = this.pointForm.value.state;
    this.point.district = this.pointForm.value.district;
    this.point.county = this.pointForm.value.county;

    this.point.locality = this.pointForm.value.locality;
    this.point.city_district = this.pointForm.value.city_district;

    this.point.road = this.pointForm.value.road;
    this.point.house_number = this.pointForm.value.house_number;

    this.point.stabilization = this.pointForm.value.stabilization;
    this.point.found = this.pointForm.value.found;
    console.log(this.point);
  }

  ngOnDestroy() {
    this.cdr.detach();
    this.sub.unsubscribe();
  }

  displayPoint() {
    const latlong = [this.point.X_WGS84, this.point.Y_WGS84];
    this.getPosts(latlong);
    const cords = [this.point.X_WGS84, this.point.Y_WGS84];
    this._mapService.filter2(cords);
  }
}
