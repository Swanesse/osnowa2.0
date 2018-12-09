import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-choose-height',
  templateUrl: './choose-height.component.html',
  styleUrls: ['./choose-height.component.scss']
})
export class ChooseHeightComponent implements OnInit {
  faInfo = faInfoCircle;
  public mask = [/[- 0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[.0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  @Input() pointForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
