import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-side-panel-header',
  templateUrl: './side-panel-header.component.html',
  styleUrls: ['./side-panel-header.component.scss']
})
export class SidePanelHeaderComponent {
  @Input() header: string;
  @Input() pointId;

  constructor() {
  }
}
