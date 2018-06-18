import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
import {PointDetails} from "../../models/PointDetails";
import proj4 from "proj4";

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit {

  location = false;
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
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  constructor() {
    proj4.defs([
      ["EPSG:2176", "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2177", "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2178", "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2179", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"]
    ]);
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

      typOsnowy: new FormControl(null),
      klasa: new FormControl(null),
      numerKatalogowy: new FormControl(null),
      woj: new FormControl(null),
      powiat: new FormControl(null),
      gmina: new FormControl(null),
      hAmsterdam: new FormControl(null),
      HKronsztadt: new FormControl(null),
      stabilizacja: new FormControl(null),
      typZnaku: new FormControl(null),
      znaleziono: new FormControl(null),
    });
  }

  ifXisBlur() {
    this.isXBlur = true;
  }

  ifYisBlur() {
    this.isYBlur = true;

  }

  transformCoordinates() {
    let X = this.pointForm.value.X;
    let Y = this.pointForm.value.Y;

    if (this.pointForm.get('X').valid && this.pointForm.get('Y').valid) {
      if (Y) {
        if (X) {

          if (X >= -90) {
            if (Y >= -180) {
              if (Y >= 14.1400) {
                if (Y <= 16.5000) {

                  //2000 zone 5
                  if (X >= 50.25 && X <= 54.5) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      console.log('Wpisane współrzędne nie są w układzie 2000');

                    }
                  }
                }
                else if (Y <= 19.5000) {

                  //2000 zone 6
                  if (X >= 49.3300 && X <= 54.8300) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');

                    }
                  }
                }
                else if (Y <= 22.5000) {

                  //2000 zone 7
                  if (X >= 49.0900 && X <= 54.5000) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna X jest niepoprawna');
                    }
                    else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      console.log('Wpisane współrzędne nie są w układzie 2000 3');
                    }
                  }

                }

                else if (Y <= 24.1600) {

                  //2000 zone 8
                  if (X >= 49.0300 && X <= 54.4500) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (X > 90) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      this.validX = '1';
                      this.validY = '1';
                      this.point.X_WGS84 = X;
                      this.point.Y_WGS84 = Y;
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');

                    }
                  }
                }
                else if (Y >= 5438667.1168) {
                  if (Y <= 5606974.4722) {

                    //2000 zone 5
                    if (X >= 5568580.0317 && X <= 6042141.2701) {
                      this.validX = '1';
                      this.validY = '1';
                      let coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(Y), Number(X)]);
                      this.X_2000 = X;
                      this.Y_2000 = Y;
                      this.point.X_WGS84 = coordinateWGS84[1];
                      this.point.Y_WGS84 = coordinateWGS84[0];
                    }
                    else {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  }
                  else if (Y >= 6390979.5111) {
                    if (Y <= 6609020.4889) {

                      //2000 zone 6
                      if (X >= 5466989.5093 && X <= 6078869.0066) {
                        this.validX = '1';
                        this.validY = '1';
                        let coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(Y), Number(X)]);
                        this.X_2000 = X;
                        this.Y_2000 = Y;
                        this.point.X_WGS84 = coordinateWGS84[1];
                        this.point.Y_WGS84 = coordinateWGS84[0];
                      }
                      else {
                        this.validY = '0';
                        console.log('Współrzędna Y jest niepoprawna');
                      }

                    }
                    else if (Y >= 7390450.4069) {
                      if (Y <= 7609549.5931) {

                        //2000 zone 7
                        if (X >= 5440301.5811 && X <= 6042141.2701) {
                          this.validX = '1';
                          this.validY = '1';
                          let coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(Y), Number(X)]);
                          this.X_2000 = X;
                          this.Y_2000 = Y;
                          this.point.X_WGS84 = coordinateWGS84[1];
                          this.point.Y_WGS84 = coordinateWGS84[0];
                        }
                        else {
                          this.validY = '0';
                          console.log('Współrzędna Y jest niepoprawna');
                        }

                      }
                      else if (Y >= 8390318.4332) {
                        if (Y <= 8511699.5509) {

                          //2000 zone 8
                          if (X >= 5432557.9291 && X <= 6036576.6253) {
                            this.validX = '1';
                            this.validY = '1';
                            let coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(Y), Number(X)]);
                            this.X_2000 = X;
                            this.Y_2000 = Y;
                            this.point.X_WGS84 = coordinateWGS84[1];
                            this.point.Y_WGS84 = coordinateWGS84[0];
                          }
                          else {
                            this.validY = '0';
                            console.log('Współrzędna Y jest niepoprawna');
                          }
                        }
                        else {
                          this.validX = '0';
                          console.log('Współrzędna X jest niepoprawna 1');
                        }
                      }
                      else {
                        this.validX = '0';
                        console.log('Współrzędna X jest niepoprawna 2');
                      }
                    }
                    else {
                      this.validX = '0';
                      console.log('Współrzędna X jest niepoprawna 3');
                    }
                  }
                  else {
                    this.validX = '0';
                    console.log('Współrzędna X jest niepoprawna 4');
                  }
                }
                else if (X > 180) {
                  this.validX = '0';
                  console.log('Współrzędna X jest niepoprawna 5');
                }
                else {
                  this.validX = '1';
                  this.validY = '1';
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              }
              else {
                this.validX = '1';
                this.validY = '1';
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
                console.log('Wpisane współrzędne nie są w układzie 2000 2');
              }
            }
            else {
              this.validX = '0';
              console.log('Współrzędna X jest niepoprawna');
            }
          }
          else {
            this.validY = '0';
            console.log('Współrzędna Y jest niepoprawna');
          }
        }
      }
    }
  }

  transformCoordinatesWGS84() {
    let X = this.pointForm.value.X_WGS84;
    let Y = this.pointForm.value.Y_WGS84;
    console.log('wszedł');
    console.log('this.pointForm.get(\'X_WGS84\').valid', this.pointForm.get('X_WGS84').valid);
    console.log('X', X);
    if (this.pointForm.get('X').valid && this.pointForm.get('Y').valid) {

      if (Y) {
        if (X) {

          if (X >= -90) {
            if (Y >= -180) {
              if (Y >= 14.1400) {
                if (Y <= 16.5000) {

                  //2000 zone 5
                  if (X >= 50.25 && X <= 54.5) {
                    let coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w układzie 2000');
                  }
                }
                else if (Y <= 19.5000) {

                  //2000 zone 6
                  if (X >= 49.3300 && X <= 54.8300) {
                    let coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                  }
                }
                else if (Y <= 22.5000) {

                  //2000 zone 7
                  if (X >= 49.0900 && X <= 54.5000) {
                    let coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w układzie 2000 3');
                  }
                }
                else if (Y <= 24.1600) {

                  //2000 zone 8
                  if (X >= 49.0300 && X <= 54.4500) {
                    let coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                    this.X_2000 = coordinate2000[1];
                    this.Y_2000 = coordinate2000[0];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                    this.X_2000 = null;
                    this.Y_2000 = null;
                    console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                  }
                }
                else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              }
              else {
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
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
    let X = x;
    let Y = y;
    if (Y) {
      if (X) {

        if (X >= -90) {
          if (Y >= -180) {
            if (Y >= 14.1400) {
              if (Y <= 16.5000) {

                //2000 zone 5
                if (X >= 50.25 && X <= 54.5) {
                  let coordinate2000 = proj4('EPSG:2176', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                }
                else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układzie 2000');
                }
              }
              else if (Y <= 19.5000) {

                //2000 zone 6
                if (X >= 49.3300 && X <= 54.8300) {
                  let coordinate2000 = proj4('EPSG:2177', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                }
                else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');
                }
              }
              else if (Y <= 22.5000) {

                //2000 zone 7
                if (X >= 49.0900 && X <= 54.5000) {
                  let coordinate2000 = proj4('EPSG:2178', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                }
                else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w układzie 2000 3');
                }
              }
              else if (Y <= 24.1600) {

                //2000 zone 8
                if (X >= 49.0300 && X <= 54.4500) {
                  let coordinate2000 = proj4('EPSG:2179', [Number(Y), Number(X)]);
                  this.X_2000 = coordinate2000[1];
                  this.Y_2000 = coordinate2000[0];
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                }
                else {
                  this.point.X_WGS84 = X;
                  this.point.Y_WGS84 = Y;
                  this.X_2000 = null;
                  this.Y_2000 = null;
                  console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');
                }
              }
              else {
                this.point.X_WGS84 = X;
                this.point.Y_WGS84 = Y;
                this.X_2000 = null;
                this.Y_2000 = null;
                console.log('Wpisane współrzędne nie są w układze 2000 1');
              }
            }
            else {
              this.point.X_WGS84 = X;
              this.point.Y_WGS84 = Y;
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
    let X = this.pointForm.value.X_2000;
    let Y = this.pointForm.value.Y_2000;

    if (this.pointForm.get('X_2000').valid && this.pointForm.get('Y_2000').valid) {
      if (Y) {
        if (X) {
          if (Y >= 5438667.1168) {
            if (Y <= 5606974.4722) {

              //2000 zone 5
              if (X >= 5568580.0317 && X <= 6042141.2701) {
                let coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(Y), Number(X)]);
                this.X_2000 = X;
                this.Y_2000 = Y;
                this.point.X_WGS84 = coordinateWGS84[1];
                this.point.Y_WGS84 = coordinateWGS84[0];
              }
              else {
                this.point.X_WGS84 = null;
                this.point.Y_WGS84 = null;
                console.log('Współrzędna Y jest niepoprawna');
              }
            }
            else if (Y >= 6390979.5111) {
              if (Y <= 6609020.4889) {

                //2000 zone 6
                if (X >= 5466989.5093 && X <= 6078869.0066) {
                  let coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(Y), Number(X)]);
                  this.X_2000 = X;
                  this.Y_2000 = Y;
                  this.point.X_WGS84 = coordinateWGS84[1];
                  this.point.Y_WGS84 = coordinateWGS84[0];
                }
                else {
                  this.point.X_WGS84 = null;
                  this.point.Y_WGS84 = null;
                  console.log('Współrzędna Y jest niepoprawna');
                }

              }
              else if (Y >= 7390450.4069) {
                if (Y <= 7609549.5931) {

                  //2000 zone 7
                  if (X >= 5440301.5811 && X <= 6042141.2701) {
                    let coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(Y), Number(X)]);
                    this.X_2000 = X;
                    this.Y_2000 = Y;
                    this.point.X_WGS84 = coordinateWGS84[1];
                    this.point.Y_WGS84 = coordinateWGS84[0];
                  }
                  else {
                    this.point.X_WGS84 = null;
                    this.point.Y_WGS84 = null;
                    console.log('Współrzędna Y jest niepoprawna');
                  }

                }
                else if (Y >= 8390318.4332) {
                  if (Y <= 8511699.5509) {

                    //2000 zone 8
                    if (X >= 5432557.9291 && X <= 6036576.6253) {
                      let coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(Y), Number(X)]);
                      this.X_2000 = X;
                      this.Y_2000 = Y;
                      this.point.X_WGS84 = coordinateWGS84[1];
                      this.point.Y_WGS84 = coordinateWGS84[0];
                    }
                    else {
                      this.point.X_WGS84 = null;
                      this.point.Y_WGS84 = null;
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  }
                  else {
                    this.point.X_WGS84 = null;
                    this.point.Y_WGS84 = null;
                    console.log('Współrzędna X jest niepoprawna 1');
                  }
                }
                else {
                  this.point.X_WGS84 = null;
                  this.point.Y_WGS84 = null;
                  console.log('Współrzędna X jest niepoprawna 2');
                }
              }
              else {
                this.point.X_WGS84 = null;
                this.point.Y_WGS84 = null;
                console.log('Współrzędna X jest niepoprawna 3');
              }
            }
            else {
              this.point.X_WGS84 = null;
              this.point.Y_WGS84 = null;
              console.log('Współrzędna X jest niepoprawna 4');
            }
          }
          else {
            this.point.X_WGS84 = null;
            this.point.Y_WGS84 = null;
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
      let that = this;
      navigator.geolocation.getCurrentPosition(function (location) {
        that.location = true;
        that.point.X_WGS84 = location.coords.latitude;
        that.point.Y_WGS84 = location.coords.longitude;
        // let coordinate2000 = proj4('EPSG:2179', [Number(that.point.Y_WGS84), Number(that.point.X_WGS84)]);
        // that.X_2000 = coordinate2000[1];
        // that.Y_2000 = coordinate2000[0];
        that.transformCoordinatesWGS84Location(that.point.X_WGS84, that.point.Y_WGS84);
      });
    } else {
      alert('twoja przeglądarka nie wspiera geolokacji...');
    }
  }


  //TODO poprawić walidację - Walidacja pola Y powinna zależeć od x (w której strefie teraz jestem)
  //TODO poprawić diagram - bo Y>90 a nie >180
  //TODO zrobić diagramy do dwóch pozostałych algorytmów
  //TODO get, w którego promisie będzie przekierowanie do ściżki /home (jeśli się uda zapytanie do serwera. Jeśli nie - wyświetl błąd)
  onSubmit() {
    console.log(this.point);
  }
}
