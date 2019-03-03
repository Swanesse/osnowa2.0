import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {MatMenuTrigger} from "@angular/material";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  innerWidth = window.innerWidth;
  searchForm: FormGroup;


  constructor(private httpService: HttpService,
              private router: Router,
              private mapService: MapService,) {
    this.mapService.setCloseMenu().subscribe( icon => {
      if(this.menuTrigger){
        this.menuTrigger.closeMenu();
      }

    });
  }

  ngOnInit() {

    this.searchForm = new FormGroup({
      catalogNumber: new FormControl(null),

      controlType1: new FormControl(false),
      controlType2: new FormControl(false),
      controlType3: new FormControl(false),
      controlType4: new FormControl(false),

      controlClass1: new FormControl(false),
      controlClass2: new FormControl(false),
      controlClass3: new FormControl(false),
      controlClass4: new FormControl(false),

      currentView: new FormControl(false),

      country: new FormControl(null),
      state: new FormControl(null),
      district: new FormControl(null),
      county: new FormControl(null),

      locality: new FormControl(null),
      city_district: new FormControl(null),
      road: new FormControl(null),
      house_number: new FormControl(null),

      stabilization: new FormArray([]),

      stabilization1: new FormControl(false),
      stabilization2: new FormControl(false),
      stabilization3: new FormControl(false),
      stabilization4: new FormControl(false),
      stabilization5: new FormControl(false),
      stabilization6: new FormControl(false),
      stabilization7: new FormControl(false),
      stabilization8: new FormControl(false),
      stabilization9: new FormControl(false),
      stabilization10: new FormControl(false),
      stabilization11: new FormControl(false),
      stabilization12: new FormControl(false),
      stabilization13: new FormControl(false),
      stabilization14: new FormControl(false),
      north: new FormControl(null),
      south: new FormControl(null),
      east: new FormControl(null),
      west: new FormControl(null),
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }







}
