import {AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapService} from "../../services/map.service";
import {MatSort} from "@angular/material";

@Component({
  selector: 'app-results-search',
  templateUrl: './results-search.component.html',
  styleUrls: ['./results-search.component.scss']
})
export class ResultsSearchComponent implements OnInit, AfterViewInit{
  header: string = 'Wyniki wyszukiwania';
  id;
  X_WGS84;
  Y_WGS84;
  public points;
  displayedColumns: string[] = ['id', 'X_WGS84', 'Y_WGS84', 'details'];
  dataSource = {};
  open = false;
  constructor(private mapService: MapService,
              private zone: NgZone,) {
    this.mapService.getSearchPoints().subscribe((points) => {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', points);
      this.zone.run(() => {
        this.points = points;
      })

      console.log('===================', this.points);
      this.dataSource = points;
      // this.dataSource.sort = this.sort;
      this.open = true;
    });
    console.log('===========77777========', this.points);
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(){

    console.log('===========77777========', this.points);
  }

  ngAfterViewInit(){
    // if(this.open != true){
    //   this.dataSource = this.points;
    //   this.mapService.getSearchPoints().subscribe((points) => {
    //     this.points = points;
    //     this.dataSource = this.points;
    //     // this.dataSource.sort = this.sort;
    //     this.open = true;
    //   });
    // }
  }
  zmien(){
    this.dataSource = this.points;
    // this.mapService.getSearchPoints().subscribe((points) => {
    //   this.points = points;
    //   this.dataSource = this.points;
    //   // this.dataSource.sort = this.sort;
    //   this.open = true;
    //
    // });
    console.log('========888===========', this.points);
    this.dataSource = this.points;
    console.log(this.dataSource);
  }
}
