import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormGroup, Validators, AbstractControl, ValidationErrors, FormBuilder} from '@angular/forms';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";
import {Point} from "../../models/Point";
import {Router} from "@angular/router";
import {LayerGroup} from "leaflet";
import {MapService} from "../../services/map.service";


@Component({
  selector: 'app-point-add',
  templateUrl: './point-add.component.html',
  styleUrls: ['./point-add.component.scss']
})
export class PointAddComponent implements OnDestroy{
  @Output() myEvent: EventEmitter<any> = new EventEmitter();
  pickMode: boolean = false;
  header: string = 'Dodaj punkt';
  faInfo = faInfoCircle;
  checked: boolean = true;
  X;
  Y;
  X_2000;
  Y_2000;
  point: Point = new Point();
  files = {imageUrls: [] = [], fileToUpload: [] = []};

  pointForm: FormGroup = this.fb.group({
    X: [null, [Validators.required, this.ValidatorX]],
    Y: [null, [Validators.required, this.ValidatorY]],

    X_WGS84: [null, [Validators.required, this.ValidatorXWGS84]],
    Y_WGS84: [null, [Validators.required, this.ValidatorYWGS84]],

    X_2000: [null, this.ValidatorX2000],
    Y_2000: [null, this.ValidatorY2000],

    X_local: [null],
    Y_local: [null],

    controlType: [null],
    controlClass: [null],
    catalogNumber: [null],

    hAmsterdam: [null],
    hKronsztadt: [null],

    country: [null],
    state: [null],
    district: [null],
    county: [null],

    locality: [null],
    city_district: [null],
    road: [null],
    house_number: [null],

    stabilization: [null],
    found: [0]
  });

  constructor(private httpService: HttpService,
              private router: Router,
              private fb: FormBuilder,
              private mapService: MapService,) {
  }

  ngOnDestroy(){
    this.mapService.setNewPoint();

  }

  ValidatorX(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -180 || (x > 180 && x < 5438667.1168) || (x > 5606974.4722 && x < 6390979.5111) || (x > 6609020.4889 && x < 7390450.4069) || (x > 7609549.5931 && x < 8390318.4332) || x > 8511699.5509) {
      return {unproper: true};
    }
  }

  ValidatorY(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -90 || (y > 90 && y < 5432557.9291) || (y > 6078869.0066)) {
      return {unproper: true};
    }
  }

  ValidatorXWGS84(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -180 || x > 180) {
      return {unproper: true};
    }
  }

  ValidatorYWGS84(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -90 || y > 90) {
      return {unproper: true};
    }
  }

  ValidatorX2000(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if ((x < 5438667.1168 || (x > 5606974.4722 && x < 6390979.5111) || (x > 6609020.4889 && x < 7390450.4069) || (x > 7609549.5931 && x < 8390318.4332) || x > 8511699.5509) && x != null && x != "") {
      return {unproper: true};
    }
  }

  ValidatorY2000(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if ((y < 5432557.9291 || y > 6078869.0066) && y != null && y != "") {
      return {unproper: true};
    }
  }

  onSubmit() {
    console.log('formularz: ', this.pointForm);
    // if (){
    //   this.pointForm.value.found = 1;
    // }
    if (this.pointForm.valid) {
      Object.keys(this.pointForm.value).forEach(key => {
        this.point[key] = this.pointForm.value[key] === '' ? null : this.pointForm.value[key];
      });
      this.httpService.addPoint(this.point, this.files.fileToUpload).subscribe(
        point => {
          this.router.navigate(['/home/detail/' + point.id]);
        },
        error => {
          console.log(error.statusText);
        });
    }
  }

  grtPhotos(files) {
    this.files = files;
  }

  changePickMode(pickMode) {
    this.pickMode = pickMode;
  }

  changeChecked(){
    if(this.pointForm.value.found == 0){
      this.pointForm.value.found =1
    } else {
      this.pointForm.value.found = 0;
    }
  }
}
