import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {PointDetails} from "../../models/PointDetails";
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit {

  point = new PointDetails();
  coordinateExistX: boolean = false;
  coordinateExistY: boolean = false;
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  constructor(private cdRef: ChangeDetectorRef) {
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

  inputCoordinateX() {

    this.coordinateExistX = true;
    if (this.pointForm.value.X) {


      if (this.pointForm.value.X > 100) {
        this.point.X_2000 = this.pointForm.value.X;
        this.point.X_WGS84 = this.pointForm.value.X / 1000.1;
      }
      else {
        this.point.X_2000 = this.pointForm.value.X * 1000.1;
        this.point.X_WGS84 = this.pointForm.value.X;
      }
    }
  }

  outputCoordinateX() {
    this.coordinateExistX = false;
  }

  inputCoordinateY() {

    this.coordinateExistY = true;
    if (this.pointForm.value.Y) {
      if (this.pointForm.value.Y > 100) {
        this.point.Y_2000 = this.pointForm.value.Y;
        this.point.Y_WGS84 = (this.pointForm.value.Y / 1000.1);
      }
      else {
        this.point.Y_2000 = (this.pointForm.value.Y * 1000.1);
        this.point.Y_WGS84 = this.pointForm.value.Y;
      }
    }
    this.cdRef.detectChanges();


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
