import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-choose-stabilization',
  templateUrl: './choose-stabilization.component.html',
  styleUrls: ['./choose-stabilization.component.scss']
})
export class ChooseStabilizationComponent implements OnInit {
  faInfo = faInfoCircle;
  @Input() pointForm: FormGroup;
  stabilizationWays: Array<String> = ['bolec', 'pal drewniany', 'kamień naturalny', 'pręt', 'rurka', 'słupek betonowy', 'szczegół terenowy', 'inny'];

  constructor() { }

  ngOnInit() {
  }

}
