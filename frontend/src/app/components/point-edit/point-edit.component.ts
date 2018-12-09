import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {MapService} from "../../services/map.service";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-point-edit',
  templateUrl: './point-edit.component.html',
  styleUrls: ['./point-edit.component.scss']
})
export class PointEditComponent implements OnInit, OnDestroy {

  point;
  pointForm;
  pickMode: boolean = false;

  files = {imageUrls: [] = [], fileToUpload: [] = []};
  images: Array<string>;
  header: string = 'Edytuj punkt';
  checked = false;

  constructor(private route: ActivatedRoute,
              private mapService: MapService,
              private fb: FormBuilder,
              private httpService: HttpService,
              private router: Router,) {
    route.params.subscribe(val => {
      this.point = this.route.snapshot.data.point.data[0];
      this.images = this.route.snapshot.data.point.data[1];
    });
    this.mapService.setPoint(this.point.id);
  }

  ngOnInit() {

    this.pointForm = this.fb.group({
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

  ngOnDestroy(){
    this.mapService.setOldIcon(this.point);
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

  changePickMode(pickMode){
    this.pickMode = pickMode;
  }

  grtPhotos(files){
    this.files = files;
  }

  onSubmit() {
    console.log('zapisz', this.pointForm);

    if (this.pointForm.valid) {
      console.log('pointForm valid');
      Object.keys(this.pointForm.value).forEach(key => {
        this.point[key] = this.pointForm.value[key] === '' ? null : this.pointForm.value[key];
      });

      this.httpService.editPoint(this.point, this.files.fileToUpload).subscribe(
        point => {
          this.mapService.setDeleteEditPoint(this.point.id);
          this.router.navigate(['/home/detail/' + point.id]);

        },
        error => {
          console.log(error.statusText);
        });
    }
  }

  changeChecked(){
    if(this.checked == true){
      this.pointForm.value.found = this.pointForm.value.found - 1;
      this.checked = false;
    } else {
      this.pointForm.value.found = this.pointForm.value.found + 1;
      this.checked = true;
    }
  }

}
