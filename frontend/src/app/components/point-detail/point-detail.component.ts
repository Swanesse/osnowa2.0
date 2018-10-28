import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation} from 'ngx-gallery';
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms';


@Component({
  selector: 'app-point-details',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})
export class PointDetailComponent implements OnInit {

  point;
  images: Array<string>;
  header: string = 'Szczegóły punktu';
  scrollBar: string = 'auto';

  constructor(private router: Router,
              private route: ActivatedRoute,) {

    route.params.subscribe(val => {
      this.point = this.route.snapshot.data.point.data[0];
      this.images = this.route.snapshot.data.point.data[1];
    });
  }

  ngOnInit(): void {}

  deleteScrollBar() {
    this.scrollBar = 'hidden';
  }

  addScrollBar() {
    this.scrollBar = 'auto';
  }



  editPoint(){
    console.log('editPoint');
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
}
