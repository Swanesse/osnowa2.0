import {ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormBuilder} from '@angular/forms';
import proj4 from 'proj4';
import {MapService} from '../../services/map.service';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {HttpService} from "../../services/http.service";
import {Point} from "../../models/Point";
import {Router} from "@angular/router";
import * as _ from 'lodash';


@Component({
  selector: 'app-point-details',
  templateUrl: './point-add.component.html',
  styleUrls: ['./point-add.component.scss']
})
export class PointAddComponent implements OnInit {
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  pickMode: boolean = false;

  pointForm : FormGroup = this.fb.group({
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
    id: [null],

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

  header: string = 'Dodaj punkt';

  faInfo = faInfoCircle;
  checked: boolean = true;

  X;
  Y;
  X_2000;
  Y_2000;
  point: Point = new Point();


  stabilizationWays: Array<String> = ['bolec', 'pal drewniany', 'kamień naturalny', 'pręt', 'rurka', 'słupek betonowy', 'szczegół terenowy', 'inny'];
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  files;

  constructor(private mapService: MapService,
              private cdr: ChangeDetectorRef,
              private httpService: HttpService,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
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



  onSubmit() {
    if (this.pointForm.valid) {
      Object.keys(this.pointForm.value).forEach(key => {
        this.point[key] = this.pointForm.value[key] === '' ? null : this.pointForm.value[key];
      });
      this.httpService.addPoint(this.point, this.files.fileToUpload).subscribe(
        point => {
          this.router.navigate(['/home']);
        },
        error => {
          console.log(error.statusText);
        });
    }
  }



  updateIcon() {
    if (this.pointForm.get('X_WGS84').valid && this.pointForm.get('Y_WGS84').valid) {
      this.mapService.setChangeCords([this.pointForm.get('X_WGS84').value, this.pointForm.get('Y_WGS84').value])
    }
  }

  chooseNetworkType() {
    if (this.pointForm.value.controlType === 'pozioma' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_pozioma.png');
      this.updateIcon();
    } else if (this.pointForm.value.controlType === 'wysokosciowa' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_wysokosciowa.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'dwufunkcyjna' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_xyh.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'pozioma' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_pozioma.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'wysokosciowa' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_wysokosciowa.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'dwufunkcyjna' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_xyh.png');
      this.updateIcon();

    } else {
      this.mapService.changeIcon('assets/podstawowa_pozioma.png');
      this.updateIcon();

    }
  }

  grtPhotos(files){
    this.files = files;
  }

  changePickMode(pickMode){
    this.pickMode = pickMode;
  }
}
