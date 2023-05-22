import { Component, OnInit } from '@angular/core';
import { Egreso } from 'src/app/models/egreso.model';
import { EgresoService } from 'src/app/services/egreso.service';
import { EgresosReport } from '../../reports/EgresosReport';

@Component({
  selector: 'app-reporte-egresos',
  templateUrl: './reporte-egresos.component.html'
})
export class ReporteEgresosComponent implements OnInit {

  egresos!: Egreso[];

  constructor( private egresosService: EgresoService ) { }

  ngOnInit(): void {
  }

  reporte(){
    this.egresosService.getAll()
    .subscribe({
      next: (resp: Egreso[])=> this.egresos = resp,
      error: (err: any)=> console.log(err),
      complete: ()=> {
        let pdf: EgresosReport = new EgresosReport(
          'REPORTE DE EGRESOS',
          this.egresos.sort()
        );

        pdf.reporte();
      }
    });
  }

}
