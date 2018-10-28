import {Component, Input, OnInit} from '@angular/core';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery";

@Component({
  selector: 'app-photos-display',
  templateUrl: './photos-display.component.html',
  styleUrls: ['./photos-display.component.scss']
})
export class PhotosDisplayComponent implements OnInit {
  @Input() imagess: Array<string>;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() {
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        width: '360px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewFullscreen: true,
        previewKeyboardNavigation: true,
        previewCloseOnEsc: true,
        previewZoom: true,
      },
      {
        breakpoint: 800,
        width: '100%',
        height: '400px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 0,
        thumbnailMargin: 0
      },
      {
        breakpoint: 500,
        thumbnailsColumns: 3,
      }
    ];
    this.createGallery();
  }

  createGallery() {
    this.galleryImages = [];

    Object.keys(this.imagess).forEach(key => {
      let image = this.imagess[key].image === '' ? null : 'http://localhost:8000' + this.imagess[key].image;
      console.log('this.image: ', image);
      this.galleryImages.push({
        small: image,
        medium: image,
        big: image
      });
    });
  }

}