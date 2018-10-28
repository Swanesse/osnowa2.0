import {Component, Input, OnInit} from '@angular/core';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-choose-local-coordinates',
  templateUrl: './choose-local-coordinates.component.html',
  styleUrls: ['./choose-local-coordinates.component.scss']
})
export class ChooseLocalCoordinatesComponent implements OnInit {
  @Input() parent: FormGroup;
  faInfo = faInfoCircle;
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  constructor() { }

  ngOnInit() {
  }

}
