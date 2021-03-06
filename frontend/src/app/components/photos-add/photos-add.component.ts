import {Component, EventEmitter, Output} from '@angular/core';
import {NotificationsService} from "angular2-notifications";

@Component({
  selector: 'app-photos-add',
  templateUrl: './photos-add.component.html',
  styleUrls: ['./photos-add.component.scss']
})
export class PhotosAddComponent {
  @Output() filesEmitter = new EventEmitter;

  files = {imageUrls: [] = [], fileToUpload: [] = []};
  drag: boolean = false;

  constructor(private _notificationsService: NotificationsService,) {

  }

  public options = {
    timeOut: 0,
    lastOnBottom: true,
    clickToClose: true,
    maxLength: 0,
    maxStack: 7,
    showProgressBar: true,
    pauseOnHover: true,
    rtl: false,
    animate: 'scale',
    position: ['right', 'bottom']
  };

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
      let unproperFiles = false;

      for (let i = 0; i < file.length; i++) {
        if (!file[i].name.toLowerCase().endsWith('.jpg')
          && !file[i].name.toLowerCase().endsWith('.jpeg')
          && !file[i].name.toLowerCase().endsWith('.png')) {
          this._notificationsService.warn('Uwaga', 'Zdjęcie tylko w formacie: JPG, JPEG, PNG');
          unproperFiles = true;
          return;
        }
      }

      for (let i = 0; i < file.length; i++) {
        if (unproperFiles === false) {
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
      }
      if (unproperFiles === false) {
        this.filesEmitter.emit(this.files);
      }
    }
  }
}
