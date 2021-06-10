import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEstados'
})
export class FilterEstadosPipe implements PipeTransform {

  transform(items: any[], filter: String): any {
    if (!items || !filter) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    
    return items.filter(it => 
      it.expositor['pais'].toLowerCase().indexOf(filter.toLowerCase()) !=-1);
}
}
