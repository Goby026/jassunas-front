import { Pipe, PipeTransform } from '@angular/core';
import { MESES } from 'src/app/enums/meses.data';

@Pipe({
  name: 'meses'
})
export class MesesPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {

    let month = MESES.filter( (item)=> {
      return item.valor === value;
    } );

    return month[0].mes;
  }

}
