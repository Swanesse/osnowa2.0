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

  stabilization = [
    { stabilizationID: 'stabilization1', name: 'słup betonowy'},
    { stabilizationID: 'stabilization2', name: 'słup granitowy lub bazaltowy'},
    { stabilizationID: 'stabilization3', name: 'odlew żeliwny w kształcie ostrosłupa'},
    { stabilizationID: 'stabilization4', name: 'skrzynka z odlewu żeliwnego'},
    { stabilizationID: 'stabilization5', name: 'pal drewniany'},
    { stabilizationID: 'stabilization6', name: 'rura kan. wypełniona cementem'},
    { stabilizationID: 'stabilization7', name: 'słup obserwacyjny'},
    { stabilizationID: 'stabilization8', name: 'reper'},
    { stabilizationID: 'stabilization9', name: 'stacja referencyjna'},
    { stabilizationID: 'stabilization10', name: 'bolec'},
    { stabilizationID: 'stabilization11', name: 'kamień naturalny'},
    { stabilizationID: 'stabilization12', name: 'pręt'},
    { stabilizationID: 'stabilization13', name: 'rurka'},
    { stabilizationID: 'stabilization14', name: 'szczegół terenowy'}
  ];

  stabilizationWays: Array<String> = ['słup betonowy', 'słup granitowy lub bazaltowy', 'odlew żeliwny w kształcie ostrosłupa', 'skrzynka z odlewu żeliwnego', 'pal drewniany', 'rura kan. wypełniona cementem', 'słup obserwacyjny', 'reper', 'stacja referencyjna', 'bolec', 'kamień naturalny', 'pręt', 'rurka', 'szczegół terenowy'];
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
    console.log(this.searchForm, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
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
    this.httpService.searchPoints(
      this.searchForm.get('catalogNumber').value,
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

      this.searchForm.get('stabilization1').value,
      this.searchForm.get('stabilization2').value,
      this.searchForm.get('stabilization3').value,
      this.searchForm.get('stabilization4').value,
      this.searchForm.get('stabilization5').value,
      this.searchForm.get('stabilization6').value,
      this.searchForm.get('stabilization7').value,
      this.searchForm.get('stabilization8').value,
      this.searchForm.get('stabilization9').value,
      this.searchForm.get('stabilization10').value,
      this.searchForm.get('stabilization11').value,
      this.searchForm.get('stabilization12').value,
      this.searchForm.get('stabilization13').value,
      this.searchForm.get('stabilization14').value
      ).subscribe(
      points => {
        this.mapService.setSearchPoints(points);

      },
      error => {
        console.log(error.statusText);
      });
    this.router.navigate(['/home/search/']);
        this.menuTrigger.closeMenu();
        this.mapService.closeMenu();

  }

  disableInput() {
    this.disabled = 'true';
    this.value = '';
  }


  undisableInput(){
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
        },
        error => {
          console.log(error.statusText);
        });

      this.router.navigate(['/home/search/']);
      this.mapService.closeMenu();
    }
  }

}
