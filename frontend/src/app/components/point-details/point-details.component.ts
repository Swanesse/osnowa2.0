import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {PointDetails} from "../../models/PointDetails";

@Component({
  selector: 'app-point-details',
  templateUrl: './point-details.component.html',
  styleUrls: ['./point-details.component.scss']
})
export class PointDetailsComponent implements OnInit {

  point = new PointDetails();
  coordinateExist: boolean = false;

  constructor() {
  }

  ngOnInit() {
    // this.route.paramMap.subscribe(data => {
    //   this.point = data;
    // })
    this.pointForm = new FormGroup({
      typOsnowy: new FormControl(null),
      klasa: new FormControl(null),
      numerKatalogowy: new FormControl(null),
      woj: new FormControl(null),
      powiat: new FormControl(null),
      gmina: new FormControl(null),
      wsp2000: new FormControl(null),
      wspLokalne: new FormControl(null, Validators.required),
      wspWGS84: new FormControl(null, Validators.required),
      hAmsterdam: new FormControl(null),
      HKronsztadt: new FormControl(null),
      stabilizacja: new FormControl(null),
      typZnaku: new FormControl(null),
      znaleziono: new FormControl(null),

    })
  }

  inputCoordinate() {

      this.coordinateExist = true;


  }

  pointForm: FormGroup;


  //TODO get, w którego promisie będzie przekierowanie do ściżki /home (jeśli się uda zapytanie do serwera. Jeśli nie - wyświetl błąd)
  onSubmit() {
    console.log(this.point);

  }

}
