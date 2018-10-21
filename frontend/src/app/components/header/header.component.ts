import {Component, HostListener, ViewEncapsulation, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit{
  value = '';
  disabled = 'false';
  innerWidth = window.innerWidth;
  stabilizationWays: Array<String> = ['bolec', 'pal drewniany', 'kamień naturalny', 'pręt', 'rurka', 'słupek betonowy', 'szczegół terenowy', 'inny'];
  searchForm: FormGroup;
  panelOpenState = false;
  step = 0;
  customCollapsedHeight: string = '40px';
  customExpandedHeight: string = '40px';
  allExpandState = false;


  constructor() {
  }

  ngOnInit() {

    this.searchForm = new FormGroup({
      catalogNumber: new FormControl(null),

      controlType1: new FormControl(false),
      controlType2: new FormControl(false),
      controlType3: new FormControl(false),

      controlClass1: new FormControl(false),
      controlClass2: new FormControl(false),
      controlClass3: new FormControl(false),

      currentView: new FormControl(false),

      country: new FormControl(null),
      state: new FormControl(null),
      district: new FormControl(null),
      county: new FormControl(null),

      locality: new FormControl(null),
      city_district: new FormControl(null),
      road: new FormControl(null),
      house_number: new FormControl(null),

      stabilization: new FormControl(null),
      found: new FormControl(false),
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
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
    }
    console.log('Wpisany tekst: ', event.target.value);
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
}
