import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Router} from "@angular/router";
import {MapService} from "../../services/map.service";
import {FormGroup} from "@angular/forms";
import {MatMenuTrigger} from "@angular/material";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  allExpandState = false;
  stabilizationWays: Array<String> = ['bolec', 'pal drewniany', 'kamień naturalny', 'pręt', 'rurka', 'słupek betonowy', 'szczegół terenowy', 'inny'];
  panelOpenState = false;
  disabled = 'false';
  step = 0;
  @Input() searchForm: FormGroup;
  value = '';
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;


  constructor(private httpService: HttpService,
              private router: Router,
              private mapService: MapService,) { }

  ngOnInit() {
  }

  getBackgroundColor() {
    return this.disabled === 'true' ? '#eeeeee' : 'white';
  }


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onSubmit(){
    console.log('submit');

    this.httpService.searchPoints(this.searchForm.get('catalogNumber').value,
      this.searchForm.get('controlType1').value,
      this.searchForm.get('controlType2').value,
      this.searchForm.get('controlType3').value,
      this.searchForm.get('controlClass1').value,
      this.searchForm.get('controlClass2').value,
      this.searchForm.get('controlClass3').value,
      this.searchForm.get('currentView').value,
      this.searchForm.get('country').value,
      this.searchForm.get('state').value,
      this.searchForm.get('district').value,
      this.searchForm.get('county').value,
      this.searchForm.get('locality').value,
      this.searchForm.get('city_district').value,
      this.searchForm.get('road').value,
      this.searchForm.get('house_number').value,
      this.searchForm.get('stabilization').value,
      this.searchForm.get('found').value).subscribe(
      points => {
        this.mapService.setSearchPoints(points);
        this.router.navigate(['/home/search/']);
        this.menuTrigger.closeMenu();
        this.mapService.closeMenu();
      },
      error => {
        console.log(error.statusText);
      });

  }

  disableInput() {
    console.log('działa');
    this.disabled = 'true';
    this.value = '';
  }


  undisableInput(){
    console.log('undisabled');
    this.disabled = 'false';
  }

  keyDownFunction(event){

    if(event.keyCode == 13) {
      console.log('Wciśnięto ENTER - wykonaj zapytanie do BD!!!');

      this.value ='';
      event.target.blur();
      this.httpService.searchPoint(event.target.value).subscribe(
        points => {
          this.mapService.setSearchPoints(points);
          this.router.navigate(['/home/search/']);
          this.mapService.closeMenu();
        },
        error => {
          console.log(error.statusText);
        });
    }
    console.log('Wpisany tekst: ', event.target.value);
  }

}
