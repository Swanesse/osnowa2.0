import {Component, OnChanges, OnInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {Point} from "../../models/Point";
import {FormControl, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../services/http.service";
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';



@Component({
  selector: 'app-point-details',
  templateUrl: './point-detail.component.html',
  styleUrls: ['./point-detail.component.scss']
})
export class PointDetailComponent implements OnInit, OnChanges {

  X_WGS84;
  Y_WGS84;

  X_2000;
  Y_2000;

  X_local;
  Y_local;

  controlType;
  controlClass;
  id;

  hAmsterdam;
  hKronsztadt;

  country;
  state;
  district;
  county;

  locality;
  city_district;
  road;
  house_number;

  stabilization;
  found;
  point;
  images: Array<string>;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private router: Router,
              private route: ActivatedRoute,) {

route.params.subscribe(val => {
    // put the code from `ngOnInit` here
  this.point = this.route.snapshot.data.point.data[0];
  this.images = this.route.snapshot.data.point.data[1];
  console.log(this.point);
  console.log(this.images);

    this.X_WGS84 = this.point.X_WGS84;
    this.Y_WGS84 = this.point.Y_WGS84;
    //     this.X_2000 = point.X_2000;
    // this.Y_2000 = point.Y_2000;

    this.X_local = this.point.X_local;
    this.Y_local = this.point.Y_local;

    this.controlType = this.point.controlType;
    this.controlClass = this.point.controlClass;
    this.id = this.point.id;

    this.hAmsterdam = this.point.hAmsterdam;
    this.hKronsztadt = this.point.hKronsztadt;

    this.country = this.point.country;
    this.state = this.point.state;
    this.district = this.point.district;
    this.county = this.point.county;

    this.locality = this.point.locality;
    this.city_district = this.point.city_district;
    this.road = this.point.road;
    this.house_number = this.point.house_number;

    this.stabilization = this.point.stabilization;
    this.found = this.point.found;
  });


  }

  ngOnInit(): void {

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: 'assets/podstawowa_pozioma.png',
        medium: 'assets/podstawowa_pozioma.png',
        big: 'assets/podstawowa_pozioma.png'
      },
      {
        small: 'assets/logo.png',
        medium: 'assets/logo.png',
        big: 'assets/logo.png'
      },
      {
        small: 'assets/location.png',
        medium: 'assets/location.png',
        big: 'assets/location.png'
      }
    ];
  }

  ngOnChanges(){
    console.log('onChanges');

  }
}
