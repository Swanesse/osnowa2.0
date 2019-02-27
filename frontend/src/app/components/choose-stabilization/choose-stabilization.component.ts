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
  stabilizationWays: Array<String> = ['słup betonowy', 'słup granitowy lub bazaltowy', 'odlew żeliwny w kształcie ostrosłupa', 'skrzynka z odlewu żeliwnego', 'pal drewniany', 'rura kanalizacyjna wypełniona cementem z gwoździem osadzonym w górnej części znaku', 'słup obserwacyjny', 'reper', 'stacja referencyjna', 'bolec', 'kamień naturalny', 'pręt', 'rurka', 'szczegół terenowy', 'inny'];

  constructor() { }

  ngOnInit() {
  }

}
