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

  X;
  Y;
  X_2000;
  Y_2000;
  point = new PointDetails();
  validX: string = '13';
  validY: string = '13';
  isXBlur: boolean = false;
  isYBlur: boolean = false;
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
      Y: new FormControl(null, [Validators.required, control => this.ValidatorX(control)]),

      X_WGS84: new FormControl(null, Validators.required),
      Y_WGS84: new FormControl(null, Validators.required),

      X_2000: new FormControl(null),
      Y_2000: new FormControl(null),

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
    })
  }

  ifXisBlur() {
    this.isXBlur = true;
  }

  ifYisBlur() {
    this.isYBlur = true;

  }

  transformCoordinates() {
    console.log('Wchodzi do funkcji');

    this.validX = '13';
    this.validY = '13';

    let X = this.pointForm.value.X;
    let Y = this.pointForm.value.Y;

    if (this.pointForm.get('X').valid && this.pointForm.get('Y').valid) {
      console.log('Jest valid');
      if (X) {
        if (Y) {

          if (Y >= -90) {
            if (X >= -180) {
              if (X >= 14.1400) {
                console.log('>=14.14');
                if (X <= 16.5000) {

                  //2000 zone 5
                  if (Y >= 50.25 && Y <= 54.5) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2176', [Number(X), Number(Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (Y > 180) {
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
                else if (X <= 19.5000) {

                  //2000 zone 6
                  if (Y >= 49.3300 && Y <= 54.8300) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2177', [Number(X), Number(Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (Y > 180) {
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
                else if (X <= 22.5000) {

                  //2000 zone 7
                  if (Y >= 49.0900 && Y <= 54.5000) {
                    this.validX = '1';
                    this.validY = '1';
                    let coordinate2000 = proj4('EPSG:2178', [Number(X), Number(Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (Y > 180) {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
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

                else if (X <= 24.1600) {

                  //2000 zone 8
                  if (Y >= 49.0300 && Y <= 54.4500) {
                    let coordinate2000 = proj4('EPSG:2179', [Number(X), Number(Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = X;
                    this.point.Y_WGS84 = Y;
                  }
                  else {
                    if (Y > 180) {
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
                else if (X >= 5438667.1168) {
                  console.log('X >= 5438667.1168');
                  if (X <= 5606974.4722) {

                    //2000 zone 5
                    if (Y >= 5568580.0317 && Y <= 6042141.2701) {
                      let coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(X), Number(Y)]);
                      this.X_2000 = X;
                      this.Y_2000 = Y;
                      this.point.X_WGS84 = coordinateWGS84[0];
                      this.point.Y_WGS84 = coordinateWGS84[1];
                    }
                    else {
                      this.validY = '0';
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  }
                  else if (X >= 6390979.5111) {
                    if (X <= 6609020.4889) {

                      //2000 zone 6
                      if (Y >= 5466989.5093 && Y <= 6078869.0066) {
                        let coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(X), Number(Y)]);
                        this.X_2000 = X;
                        this.Y_2000 = Y;
                        this.point.X_WGS84 = coordinateWGS84[0];
                        this.point.Y_WGS84 = coordinateWGS84[1];
                      }
                      else {
                        this.validY = '0';
                        console.log('Współrzędna Y jest niepoprawna');
                      }

                    }
                    else if (X >= 7390450.4069) {
                      if (X <= 7609549.5931) {

                        //2000 zone 7
                        if (Y >= 5440301.5811 && Y <= 6042141.2701) {
                          let coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(X), Number(Y)]);
                          this.X_2000 = X;
                          this.Y_2000 = Y;
                          this.point.X_WGS84 = coordinateWGS84[0];
                          this.point.Y_WGS84 = coordinateWGS84[1];
                        }
                        else {
                          this.validY = '0';
                          console.log('Współrzędna Y jest niepoprawna');
                        }

                      }
                      else if (X >= 8390318.4332) {
                        if (X <= 8511699.5509) {

                          //2000 zone 8
                          if (Y >= 5432557.9291 && Y <= 6036576.6253) {
                            let coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(X), Number(Y)]);
                            this.X_2000 = X;
                            this.Y_2000 = Y;
                            this.point.X_WGS84 = coordinateWGS84[0];
                            this.point.Y_WGS84 = coordinateWGS84[1];
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

  outputCoordinateX() {
    this.isXBlur = false;
  }

  outputCoordinateY() {
    this.isYBlur = false;
  }

  ValidatorX(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -180 || (x > 180 && x < 5438667.1168) || (x > 5606974.4722 && x < 6390979.5111) || (x > 6609020.4889 && x < 7390450.4069) || (x > 7609549.5931 && x < 8390318.4332) || x > 8511699.5509) {
      return {unproper: true};
    }
  }

  ValidatorY(control: AbstractControl): ValidationErrors {
    const y = control.value;
    this.pointForm.value.X = 1;
    const x = control.root.get('X').value;
    if (y < -90 || (x <= 16.5000 && y > 180 && (y < 50.2500 || y > 54.5000)) || (x <= 19.5000 && y > 180 && (y < 49.3300 || y > 54.8300)) || (x <= 22.5000 && y > 189 && (y < 49.0900 || y > 54.5000)) || (x <= 24.1600 && y > 180 && (y < 49.0300 || y > 54.4500)) || (x <= 5606974.4722 && (y < 5568580.0317 || y > 6042141.2701) || (x <= 6609020.4889 && (y < 5466989.5093 || y > 6078869.0066)) || (x <= 7609549.5931 && (y < 5440301.5811 || y > 6042141.2701)) || (x <= 8511699.5509 && (y < 5432557.9291 || y > 6036576.6253)))) {
      return {unproper: true};
    }
  }

  pointForm: FormGroup;


  //TODO get, w którego promisie będzie przekierowanie do ściżki /home (jeśli się uda zapytanie do serwera. Jeśli nie - wyświetl błąd)
  onSubmit() {
    console.log(this.point);


  }

}
