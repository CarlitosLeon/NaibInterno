import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTelefonos'
})
export class FormatTelefonosPipe implements PipeTransform {

  transform(telefono: String): any {
    if (!telefono) {
      return telefono;
    }
    
    let newTel;
    let arr = telefono.match(/.{1}/g);
    
    newTel = arr[0] + arr[1] + " " + arr[2] + arr[3] + arr[4] + arr[5] + " " + arr[6] + arr[7] + arr[8] + arr[9];
    if (arr.length > 10) {
      newTel = newTel + " ";
      for (var i = 0; i < arr.length; i++) {
        if (i > 9) {
          newTel = newTel + arr[i];
        }
      }
    }
    return newTel;
  }

}
