import {ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {FormGroup, Validators, AbstractControl, ValidationErrors, FormBuilder} from '@angular/forms';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";
import {Point} from "../../models/Point";
import {Router} from "@angular/router";


@Component({
  selector: 'app-point-details',
  templateUrl: './point-add.component.html',
  styleUrls: ['./point-add.component.scss']
})
export class PointAddComponent {
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
    found: [false]
  });

  constructor(private httpService: HttpService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ValidatorX(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -180 || (y > 180 && y < 5438667.1168) || (y > 5606974.4722 && y < 6390979.5111) || (y > 6609020.4889 && y < 7390450.4069) || (y > 7609549.5931 && y < 8390318.4332) || y > 8511699.5509) {
      return {unproper: true};
    }
  }

  ValidatorY(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -90 || (x > 90 && x < 5432557.9291) || (x > 6078869.0066)) {
      return {unproper: true};
    }
  }

  ValidatorXWGS84(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if (y < -180 || y > 180) {
      return {unproper: true};
    }
  }

  ValidatorYWGS84(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if (x < -90 || x > 90) {
      return {unproper: true};
    }
  }

  ValidatorX2000(control: AbstractControl): ValidationErrors {
    const y = control.value;
    if ((y < 5438667.1168 || (y > 5606974.4722 && y < 6390979.5111) || (y > 6609020.4889 && y < 7390450.4069) || (y > 7609549.5931 && y < 8390318.4332) || y > 8511699.5509) && y != null && y != "") {
      return {unproper: true};
    }
  }

  ValidatorY2000(control: AbstractControl): ValidationErrors {
    const x = control.value;
    if ((x < 5432557.9291 || x > 6078869.0066) && x != null && x != "") {
      return {unproper: true};
    }
  }

  onSubmit() {
    console.log(this.pointForm);
    if (this.pointForm.valid) {
      Object.keys(this.pointForm.value).forEach(key => {
        this.point[key] = this.pointForm.value[key] === '' ? null : this.pointForm.value[key];
      });
      console.log(this.files.fileToUpload);
      console.log(this.point);
      this.httpService.addPoint(this.point, this.files.fileToUpload).subscribe(
        point => {
          this.router.navigate(['/home']);
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
}
