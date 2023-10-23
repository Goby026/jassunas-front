import { Component, OnInit } from '@angular/core';
import { YearsService } from './../../../services/years.service';
import { MESES } from '../../../enums/meses.data';
import { Year } from 'src/app/models/Year.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import 'moment/locale/es';
import { ExcelReport } from '../../reports/ExcelReport';

@Component({
  selector: 'app-reportes-mensuales2',
  templateUrl: './reportes-mensuales2.component.html'
})
export class ReportesMensuales2Component implements OnInit {

  meses = MESES;
  years!: Year[];
  form!: FormGroup;

  pagos!: PagosServicio[];

  constructor( private yearService: YearsService, private pagosServiciosService: PagosServiciosService  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarYears();
  }

  crearFormulario(){
    this.form = new FormGroup({
      'mes': new FormControl(0, Validators.required),
      'year': new FormControl(0, Validators.required),
    });
  }

  cargarYears(){
    this.yearService.getYears()
    .subscribe({
      next: (resp)=> this.years = resp,
      error: err=> console.log(err)
    })
  }

  mostrarData(){
    if(this.form.invalid || this.form.get('mes')?.value == 0 || this.form.get('year')?.value == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Indique correctamente los parametros!'
      })
      return;
    };

    let param: string = `${this.form.get('year')?.value}-${moment().month(Number(this.form.get('mes')?.value)-1).format('MM')}`;

    this.pagosServiciosService.getPagosYearMonth(param)
    .subscribe({
      next: (resp)=> this.pagos = resp,
      error: err=> console.log(err)
    });
  }

  crearReporte() {
    Swal.fire({
      title: '¿Generar archivo Excel?',
      text: 'Se descargará el archivo',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let reporte: ExcelReport = new ExcelReport();
        reporte.reportIngresoMensual(this.pagos);
      }
    });
  }



}
