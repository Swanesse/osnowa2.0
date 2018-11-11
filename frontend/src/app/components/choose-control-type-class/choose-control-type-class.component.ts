import {Component, Input} from '@angular/core';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {MapService} from "../../services/map.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-choose-control-type-class',
  templateUrl: './choose-control-type-class.component.html',
  styleUrls: ['./choose-control-type-class.component.scss']
})
export class ChooseControlTypeClassComponent {

  faInfo = faInfoCircle;
  @Input() pointForm: FormGroup;

  constructor(private mapService: MapService,) { }

  chooseNetworkType() {
    if (this.pointForm.value.controlType === 'pozioma' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_pozioma.png');
      this.updateIcon();
    } else if (this.pointForm.value.controlType === 'wysokosciowa' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_wysokosciowa.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'dwufunkcyjna' && (this.pointForm.value.controlClass === '1' || this.pointForm.value.controlClass === '2')) {
      this.mapService.changeIcon('assets/podstawowa_xyh.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'pozioma' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_pozioma.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'wysokosciowa' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_wysokosciowa.png');
      this.updateIcon();

    } else if (this.pointForm.value.controlType === 'dwufunkcyjna' && this.pointForm.value.controlClass === '3') {
      this.mapService.changeIcon('assets/szczegolowa_xyh.png');
      this.updateIcon();

    } else {
      this.mapService.changeIcon('assets/assets/point.jpg');
      this.updateIcon();
    }
  }

  updateIcon() {
    if (this.pointForm.get('X_WGS84').valid && this.pointForm.get('Y_WGS84').valid) {
      this.mapService.setChangeCords([this.pointForm.get('X_WGS84').value, this.pointForm.get('Y_WGS84').value])
    }
  }

}
