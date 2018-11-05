import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-choose-catalog-number',
  templateUrl: './choose-catalog-number.component.html',
  styleUrls: ['./choose-catalog-number.component.scss']
})
export class ChooseCatalogNumberComponent implements OnInit {

  faInfo = faInfoCircle;
  @Input() pointForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
