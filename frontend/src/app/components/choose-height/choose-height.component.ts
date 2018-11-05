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
  @Input() pointForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
