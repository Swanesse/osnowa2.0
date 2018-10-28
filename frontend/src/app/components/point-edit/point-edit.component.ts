import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-point-edit',
  templateUrl: './point-edit.component.html',
  styleUrls: ['./point-edit.component.scss']
})
export class PointEditComponent implements OnInit {

  point;
  images: Array<string>;
  header: string = 'Edytuj punkt';

  constructor(private route: ActivatedRoute,) {
    route.params.subscribe(val => {
      this.point = this.route.snapshot.data.point.data[0];
      this.images = this.route.snapshot.data.point.data[1];
    });
  }

  ngOnInit() {
  }

}
