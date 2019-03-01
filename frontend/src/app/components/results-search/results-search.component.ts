import {Component, NgZone, ViewChild} from '@angular/core';
import {MapService} from "../../services/map.service";
import {MatSort} from "@angular/material";

@Component({
  selector: 'app-results-search',
  templateUrl: './results-search.component.html',
  styleUrls: ['./results-search.component.scss']
})
export class ResultsSearchComponent {
  header: string = 'Wyniki wyszukiwania';
  id;
  X_WGS84;
  Y_WGS84;
  public points;
  displayedColumns: string[] = ['id', 'X_WGS84', 'Y_WGS84', 'details'];
  dataSource = {};
  open = false;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private mapService: MapService,
              private zone: NgZone,) {
    this.mapService.getSearchPoints().subscribe((points) => {
      console.log('1:" ', points);
      this.zone.run(() => {
        this.points = points;
        this.dataSource = points;
      });
      // this.dataSource.sort = this.sort;
      this.open = true;
    });
  }
}
