import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { ByFechaReport } from '../reports/ByFechaReport';

@Component({
  selector: 'app-repote-byfechas',
  templateUrl: './repote-byfechas.component.html'
})
export class RepoteByfechasComponent implements OnInit {

  pagosForm!: FormGroup;
  pagosDetalles: PagosServicioDetalle[] = [];

  constructor(private pagosService: PagosServiciosService) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(){
    this.pagosForm = new FormGroup({
      inicio: new FormControl(null, Validators.required),
      fin: new FormControl(null,Validators.required),
    });
  }

  listarPagosPorFechas(){
    if (!this.pagosForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.pagosService.getDetallePagoFechas(this.pagosForm.get('inicio')?.value, this.pagosForm.get('fin')?.value)
    .subscribe({
      next: (resp: PagosServicioDetalle[])=>this.pagosDetalles = resp,
      error: error=>console.log(error),
      complete: ()=> console.log(this.pagosDetalles)
    });
  }

  crearPdf(){

    if (!this.pagosForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    if(this.pagosDetalles.length <= 0){
      alert('No hay datos para elaborar el reporte!');
      return;
    }

    let total:number = 0;
    let inicio = this.pagosForm.get('inicio')?.value;
    let fin = this.pagosForm.get('fin')?.value;

    this.pagosDetalles.map( (item)=> {
      total += Number(item.monto);
    });

    let pdf = new ByFechaReport(
      `Reporte de pagos desde ${inicio} hasta ${fin}`,
      total,
      this.pagosDetalles,
    );

    pdf.reporte();
  }

}
