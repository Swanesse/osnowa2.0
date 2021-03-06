import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDot'
})
export class ToDotPipe implements PipeTransform {

  transform(val: number): string {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      return val.toString().replace(",", ".");
    } else {
      return "";
    }
  }

}
