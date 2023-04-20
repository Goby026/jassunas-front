import { Component, OnInit } from '@angular/core';
import { CajaReport } from '../reports/CajaReport';
import { PagosServiciosService } from '../../services/pagos-servicios.service';
import { PagosServicio } from '../../models/pagosservicio.model';

@Component({
  selector: 'app-repote-bycaja',
  templateUrl: './repote-bycaja.component.html'
})
export class RepoteBycajaComponent implements OnInit {

  public idCaja: number = 0;
  public pagos!: PagosServicio[];

  constructor( private pagosServiciosService:PagosServiciosService ) { }

  ngOnInit(): void {
  }

  crearReporte(){

    if(this.idCaja <= 0){
      alert('Nro de caja inválido');
      return;
    }

    let total: number = 0.0;

    this.pagosServiciosService.tracking(this.idCaja)
    .subscribe({
      next: (resp:any)=> this.pagos = resp.pagosservicios,
      error: (err)=> console.log(err),
      complete: ()=>{
        let reporte = new CajaReport(
          'Reporte de Caja',
          total,
          this.pagos
          );
        reporte.reporte();
      }
    });
  }

}
