import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.component.html',
  styleUrls: ['./choose-location.component.scss']
})
export class ChooseLocationComponent implements OnInit {
  faInfo = faInfoCircle;
  @Input() pointForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
