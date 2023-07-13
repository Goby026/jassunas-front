import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  clientePanel: boolean = false;
  zonaPanel: boolean = false;
  tupaPanel: boolean = false;
  pagoPanel: boolean = false;
  cajaPanel: boolean = false;
  tributo: boolean = false;
  egreso: boolean = false;

  // clientes: Cliente[] = [];
  // zonas: Zona[] = [];
  // deudas: Deuda[] = [];
  // nombre_completo: string = '';

  constructor() {}

  ngOnInit(): void {}

  // getMes(){
  //   let mes = 3;
  //   let mesNombre = moment().month(mes-1).format('MMMM');
  // }

  selOpc(e:HTMLSelectElement){
    switch (e.value) {
      case 'cliente':
        this.clientePanel = true;
        this.zonaPanel = false;
        this.tupaPanel = false;
        this.pagoPanel = false;
        this.cajaPanel = false;
        this.tributo = false;
        this.egreso = false;
        break;
      case 'zona':
        this.clientePanel = false;
        this.zonaPanel = true;
        this.tupaPanel = false;
        this.pagoPanel = false;
        this.cajaPanel = false;
        this.tributo = false;
        this.egreso = false;
        break;
      case 'tupa':
        this.clientePanel = false;
        this.zonaPanel = false;
        this.tupaPanel = true;
        this.pagoPanel = false;
        this.cajaPanel = false;
        this.tributo = false;
        this.egreso = false;
        break;
      case 'pago':
        this.clientePanel = false;
        this.zonaPanel = false;
        this.tupaPanel = false;
        this.pagoPanel = true;
        this.cajaPanel = false;
        this.tributo = false;
        this.egreso = false;
        break;
      case 'caja':
          this.clientePanel = false;
          this.zonaPanel = false;
          this.tupaPanel = false;
          this.pagoPanel = false;
          this.cajaPanel = true;
          this.tributo = false;
          this.egreso = false;
          break;
      case 'tributo':
          this.clientePanel = false;
          this.zonaPanel = false;
          this.tupaPanel = false;
          this.pagoPanel = false;
          this.cajaPanel = false;
          this.tributo = true;
          this.egreso = false;
          break;
      case 'egreso':
          this.clientePanel = false;
          this.zonaPanel = false;
          this.tupaPanel = false;
          this.pagoPanel = false;
          this.cajaPanel = false;
          this.tributo = false;
          this.egreso = true;
          break;

      default:
        this.clientePanel = false;
        this.zonaPanel = false;
        this.tupaPanel = false;
        this.pagoPanel = false;
        this.cajaPanel = false;
        this.tributo = false;
        this.egreso = false;
        break;
    }
  }

}
