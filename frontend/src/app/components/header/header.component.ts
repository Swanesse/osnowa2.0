import {Component, OnInit} from '@angular/core';
import {PointDetailsComponent} from "../point-details/point-details.component";
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }
}
