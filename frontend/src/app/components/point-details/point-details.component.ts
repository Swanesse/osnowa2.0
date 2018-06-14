import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {PointDetails} from "../../models/PointDetails";
import {ChangeDetectorRef} from '@angular/core';
import proj4 from "proj4";

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit {

  X_2000;
  Y_2000;
  point = new PointDetails();
  coordinateExistX: boolean = false;
  coordinateExistY: boolean = false;
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  constructor(private cdRef: ChangeDetectorRef) {
    proj4.defs([
      ["EPSG:2176", "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2177", "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2178", "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"],
      ["EPSG:2179", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs"]
    ]);
  }

  ngOnInit() {
    // this.route.paramMap.subscribe(data => {
    //   this.point = data;
    // })
    this.pointForm = new FormGroup({
      X: new FormControl(null, Validators.required),
      Y: new FormControl(null, Validators.required),

      X_WGS84: new FormControl(null, Validators.required),
      Y_WGS84: new FormControl(null, Validators.required),

      X_2000: new FormControl(null, Validators.required),
      Y_2000: new FormControl(null, Validators.required),

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
    this.coordinateExistX = true;
  }

  ifYisBlur() {
    this.coordinateExistY = true;

  }

  transformCoordinates() {

    if (this.pointForm.get('X').valid && this.pointForm.get('Y').valid) {
      if (this.pointForm.value.X) {
        if (this.pointForm.value.Y) {

          if (this.pointForm.value.Y >= -90) {
            if (this.pointForm.value.X >= -180) {
              if (this.pointForm.value.X >= 14.1400) {
                if (this.pointForm.value.X <= 16.5000) {

                  //2000 zone 5
                  if (this.pointForm.value.Y >= 50.25 && this.pointForm.value.Y <= 54.5) {
                    console.log('weszłam');
                    let coordinate2000 = proj4('EPSG:2176', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = this.pointForm.value.X;
                    this.point.Y_WGS84 = this.pointForm.value.Y;
                  }
                  else {
                    if (this.pointForm.value.Y > 180) {
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000');

                    }
                  }

                }
                else if (this.pointForm.value.X <= 19.5000) {

                  //2000 zone 6
                  if (this.pointForm.value.Y >= 49.3300 && this.pointForm.value.Y <= 54.8300) {
                    let coordinate2000 = proj4('EPSG:2177', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = this.pointForm.value.X;
                    this.point.Y_WGS84 = this.pointForm.value.Y;
                  }
                  else {
                    if (this.pointForm.value.Y > 180) {
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 4');

                    }
                  }
                }
                else if (this.pointForm.value.X <= 22.5000) {

                  //2000 zone 7
                  if (this.pointForm.value.Y >= 49.0900 && this.pointForm.value.Y <= 54.5000) {
                    let coordinate2000 = proj4('EPSG:2178', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = this.pointForm.value.X;
                    this.point.Y_WGS84 = this.pointForm.value.Y;
                  }
                  else {
                    if (this.pointForm.value.Y > 180) {
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      console.log('Wpisane współrzędne nie są w układzie 2000 3');
                    }
                  }

                }

                else if (this.pointForm.value.X <= 24.1600) {

                  //2000 zone 8
                  if (this.pointForm.value.Y >= 49.0300 && this.pointForm.value.Y <= 54.4500) {
                    let coordinate2000 = proj4('EPSG:2179', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                    this.X_2000 = coordinate2000[0];
                    this.Y_2000 = coordinate2000[1];
                    this.point.X_WGS84 = this.pointForm.value.X;
                    this.point.Y_WGS84 = this.pointForm.value.Y;
                  }
                  else {
                    if (this.pointForm.value.Y > 180) {
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                    else {
                      console.log('Wpisane współrzędne nie są w ukłądzie 2000 3');

                    }
                  }
                }
                else if (this.pointForm.value.X >= 5438667.1168) {
                  if (this.pointForm.value.X <= 5606974.4722) {

                    //2000 zone 5
                    if (this.pointForm.value.Y >= 5568580.0317 && this.pointForm.value.Y <= 6042141.2701) {
                      let coordinateWGS84 = proj4('EPSG:2176', 'EPSG:4326', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                      this.X_2000 = this.pointForm.value.X;
                      this.Y_2000 = this.pointForm.value.Y;
                      this.point.X_WGS84 = coordinateWGS84[0];
                      this.point.Y_WGS84 = coordinateWGS84[1];
                    }
                    else {
                      console.log('Współrzędna Y jest niepoprawna');
                    }
                  }
                  else if (this.pointForm.value.X >= 6390979.5111) {
                    if (this.pointForm.value.X <= 6609020.4889) {

                      //2000 zone 6
                      if (this.pointForm.value.Y >= 5466989.5093 && this.pointForm.value.Y <= 6078869.0066) {
                        let coordinateWGS84 = proj4('EPSG:2177', 'EPSG:4326', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                        this.X_2000 = this.pointForm.value.X;
                        this.Y_2000 = this.pointForm.value.Y;
                        this.point.X_WGS84 = coordinateWGS84[0];
                        this.point.Y_WGS84 = coordinateWGS84[1];
                      }
                      else {
                        console.log('Współrzędna Y jest niepoprawna');
                      }

                    }
                    else if (this.pointForm.value.X <= 7390450.4069) {
                      if (this.pointForm.value.X <= 7609549.5931) {

                        //2000 zone 7
                        if (this.pointForm.value.Y >= 5440301.5811 && this.pointForm.value.Y <= 6042141.2701) {
                          let coordinateWGS84 = proj4('EPSG:2178', 'EPSG:4326', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                          this.X_2000 = this.pointForm.value.X;
                          this.Y_2000 = this.pointForm.value.Y;
                          this.point.X_WGS84 = coordinateWGS84[0];
                          this.point.Y_WGS84 = coordinateWGS84[1];
                        }
                        else {
                          console.log('Współrzędna Y jest niepoprawna');
                        }

                      }
                      else if (this.pointForm.value.X >= 8390318.4332) {
                        if (this.pointForm.value.X <= 8511699.5509) {

                          //2000 zone 8
                          if (this.pointForm.value.Y >= 5432557.9291 && this.pointForm.value.Y <= 6036576.6253) {
                            let coordinateWGS84 = proj4('EPSG:2179', 'EPSG:4326', [Number(this.pointForm.value.X), Number(this.pointForm.value.Y)]);
                            this.X_2000 = this.pointForm.value.X;
                            this.Y_2000 = this.pointForm.value.Y;
                            this.point.X_WGS84 = coordinateWGS84[0];
                            this.point.Y_WGS84 = coordinateWGS84[1];
                          }
                          else {
                            console.log('Współrzędna Y jest niepoprawna');
                          }
                        }
                      }
                      else {
                        console.log('Współrzędna X jest niepoprawna');
                      }
                    }
                  }
                  else {
                    console.log('Współrzędna X jest niepoprawna');
                  }

                  console.log('Współrzędna X jest niepoprawna');
                }
                else if (this.pointForm.value.X > 180) {
                  console.log('Współrzędna X jest niepoprawna');
                }
                else {
                  console.log('Wpisane współrzędne nie są w układze 2000 1');
                }
              }
              else {
                console.log('Wpisane współrzędne nie są w układzie 2000 2');
              }
            }
            else {
              console.log('Współrzędna X jest niepoprawna');
            }
          }
          else {
            console.log('Współrzędna Y jest niepoprawna');
          }
        }
      }
    }
  }

  outputCoordinateX() {
    this.coordinateExistX = false;
  }

  outputCoordinateY() {
    this.coordinateExistY = false;
  }

  pointForm: FormGroup;


  //TODO get, w którego promisie będzie przekierowanie do ściżki /home (jeśli się uda zapytanie do serwera. Jeśli nie - wyświetl błąd)
  onSubmit() {
    console.log(this.point);

  }

}
