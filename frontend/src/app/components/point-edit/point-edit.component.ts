import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-point-edit',
  templateUrl: './point-edit.component.html',
  styleUrls: ['./point-edit.component.scss']
})
export class PointEditComponent implements OnInit {

  point;
  pointForm;
  pickMode: boolean = false;

  files;
  images: Array<string>;
  header: string = 'Edytuj punkt';

  constructor(private route: ActivatedRoute,
              private mapService: MapService,
              private fb: FormBuilder) {
    route.params.subscribe(val => {
      this.point = this.route.snapshot.data.point.data[0];
      this.images = this.route.snapshot.data.point.data[1];
    });
    this.mapService.setPoint(this.point.id);
  }

  ngOnInit() {

    this.pointForm = this.fb.group({
      X: [null, [Validators.required, this.ValidatorX]],
      Y: [null, [Validators.required, this.ValidatorY]],

      X_WGS84: [this.point.X_WGS84, [Validators.required, this.ValidatorXWGS84]],
      Y_WGS84: [this.point.Y_WGS84, [Validators.required, this.ValidatorYWGS84]],

      X_2000: [null, this.ValidatorX2000],
      Y_2000: [null, this.ValidatorY2000],

      X_local: [this.point.X_local],
      Y_local: [this.point.Y_local],

      controlType: [this.point.controlType],
      controlClass: [this.point.controlClass],
      catalogNumber: [this.point.catalogNumber],

      hAmsterdam: [this.point.hAmsterdam],
      hKronsztadt: [this.point.hKronsztadt],

      country: [this.point.country],
      state: [this.point.state],
      district: [this.point.district],
      county: [this.point.county],

      locality: [this.point.locality],
      city_district: [this.point.city_district],
      road: [this.point.road],
      house_number: [this.point.house_number],

      stabilization: [this.point.stabilization],
      found: [this.point.found]
    });
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
    if ((y < 5438667.1168 || (y > 5606974.4722 && y < 6390979.5111) || (y > 6609020.4889 && y < 7390450.4069) || (y > 7609549.5931 && y < 8390318.4332) || y > 8511699.5509) && y != null && y != "") {
      return {unproper: true};
    }
  }

  ValidatorX2000(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if ((x < 5432557.9291 || x > 6078869.0066) && x != null && x != "") {
      return {unproper: true};
    }
  }

  changePickMode(pickMode){
    this.pickMode = pickMode;
  }

  grtPhotos(files){
    this.files = files;
  }

}
