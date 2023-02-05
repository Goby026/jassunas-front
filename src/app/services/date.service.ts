import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  getMes(mes: any | undefined = 0): String{
    let mesNombre:string = moment().month(Number(mes-1)).format('MMMM');
    // console.log('MES', mesNombre)
    return mesNombre;
  }

  setFormatPeriodo(fecha: Date | string){
    return moment(fecha).format('MMMM-yyyy');
  }
}
