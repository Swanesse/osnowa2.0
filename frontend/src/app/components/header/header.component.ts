import {Component, HostListener, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  disabled = 'false';
  innerWidth = window.innerWidth;

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  disableInput() {
    console.log('działa');
    this.disabled = 'true';
  }

  undisableInput(){
    console.log('undisabled');
    this.disabled = 'false';
  }
}
