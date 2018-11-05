import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-photos-add',
  templateUrl: './photos-add.component.html',
  styleUrls: ['./photos-add.component.scss']
})
export class PhotosAddComponent implements OnInit {

  @Output()
    filesEmitter = new EventEmitter;

  files = {imageUrls: [] = [], fileToUpload: [] =[]};
  drag: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  removePicture(i) {
    this.files.imageUrls.splice(i, 1);
    this.files.fileToUpload.splice(i, 1);
  }

  onDrop(event: any) {
    // event.preventDefault();
    // event.stopPropagation();
    this.drag = false;

    // your code goes here after droping files or any
  }

  onDragOver(evt) {
    this.drag = true;
    // evt.preventDefault();
    // evt.stopPropagation();
  }

  onDragLeave(evt) {
    this.drag = false;
    // evt.preventDefault();
    // evt.stopPropagation();
  }

  getBorderColor() {
    return this.drag === true ? '5px dotted #f94f41' : '5px dotted #ccc';
  }

  handleFileInput(file: FileList) {
    if (file.length > 0) {

      for (let i = 0; i < file.length; i++) {
        const reader = new FileReader();

        // Gdy zostanie wczytany plik, on ten plik przechwytuje. Jeden reader może przechwycić tylko jeden plik.
        reader.onload = (event: any) => {

          let theSame = false;
          for (let image of this.files.imageUrls) {
            if (image === event.target.result) {
              theSame = true;
              break;
            }
          }
          if (theSame === false) {
            this.files.imageUrls.push(event.target.result);
            this.files.fileToUpload.push(file[i]);

          }
        };

        reader.onerror = function (event) {
          console.error("File could not be read! Code");
        };

        // Zamienia plik na DataURL, dzięki czemu możemy go wyświetlić w przeglądarce
        reader.readAsDataURL(file[i]);
      }
      this.filesEmitter.emit(this.files);
    }
  }

}
