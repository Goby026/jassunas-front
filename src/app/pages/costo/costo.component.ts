/*ESTE MODULO IMPLEMENTA LA FUNCION PARA LOS REPORTES DEL CONTADOR*/
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-costo',
  templateUrl: './costo.component.html',
  styleUrls: ['./costo.component.css'],
})
export class CostoComponent implements OnInit {
  comprobantesIngreso1: boolean = false;
  reportesMensuales2: boolean = false;
  cuentasCobrar3: boolean = false;
  conceptosCobrables4: boolean = false;
  conceptosCobrados5: boolean = false;



  constructor() {}

  ngOnInit(): void {
  }

  selOpc(e: HTMLSelectElement) {
    switch (Number(e.value)) {
      case 1:
        this.comprobantesIngreso1 = true;
        this.reportesMensuales2 = false;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;
      case 2:
        this.comprobantesIngreso1 = false;
        this.reportesMensuales2 = true;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;
      case 3:
        this.mantenimiento();
        this.comprobantesIngreso1 = false;
        this.reportesMensuales2 = false;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;
      case 4:
        this.mantenimiento();
        this.comprobantesIngreso1 = false;
        this.reportesMensuales2 = false;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;
      case 5:
        this.mantenimiento();
        this.comprobantesIngreso1 = false;
        this.reportesMensuales2 = false;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;

      default:
        this.comprobantesIngreso1 = false;
        this.reportesMensuales2 = false;
        this.cuentasCobrar3 = false;
        this.conceptosCobrables4 = false;
        this.conceptosCobrados5 = false;
        break;
    }
  }


  mantenimiento(){
    Swal.fire({
      icon: 'error',
      title: 'Lo sentimos...',
      text: 'Esta funcion esta en mantenimiento!'
    })
  }


}
