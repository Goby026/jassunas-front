import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Corte } from 'src/app/models/corte.model';
import { CorteService } from 'src/app/services/corte.service';

import * as moment from 'moment';
import 'moment/locale/es';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { Cliente } from 'src/app/models/cliente.model';
import { Costo } from 'src/app/models/costo.model';
import { CorteReport } from './CorteReport';
import { CorteDetalle } from 'src/app/models/cortedetalle.model';
moment.locale('es');

@Component({
  selector: 'app-cortes',
  templateUrl: './cortes.component.html',
})
export class CortesComponent implements OnInit {
  public pagosDetalles: PagosServicioDetalle[] = [];
  public fecha = moment().format('Do MMMM YYYY').toUpperCase();
  public clientes: Cliente[] = [];
  public costos: Costo[] = [];
  public cortes: Corte[] = [];

  constructor(private corteService: CorteService, private router: Router) {}

  ngOnInit(): void {
    this.getCortes();
  }

  generateViewDebts() {
    let mes = moment().month() + 1;
    let acceso: boolean = true;
    //evaluar mes, sino hay registro del mes entonces continuar
    this.cortes.forEach((item) => {
      if (mes === moment(item.createdAt).month() + 1) {
        acceso = false;
        alert('Ya se hizo registro de corte de pagos ESTE MES');
      }
    });

    if (acceso) {
      this.router.navigate(['/dashboard/caja/cortes/detallecorte']);
    }
  }

  getCortes(): void {
    this.corteService.getCortes().subscribe({
      next: (resp) => {
        this.cortes = resp;
      },
      error: (err) => console.log(err.message),
    });
  }

  getReport(corte: Corte) {
    if (!confirm('¿Generar Reporte?')) {
      return;
    }

    let corteDetalles: CorteDetalle[] = [];

    this.corteService.getDetalleByCorte(corte).subscribe({
      next: (resp) => (corteDetalles = resp),
      error: (err) => console.log(err.message),
      complete: () => {
        let reporte: CorteReport = new CorteReport(
          'Corte de Agosto',
          corte,
          corteDetalles
        );
        reporte.reporte();
      },
    });
  }

  // getAllCosts(): void {
  //   this.costoService.getAll().subscribe({
  //     next: (resp) => (this.costos = resp),
  //     error: (err) => console.log(err),
  //     complete: () => {},
  //   });
  // }

  // getClientsPayment(idCliente: number, anio: number): void {
  //   this.pagosService.getDetallePagosClienteAnio(idCliente, anio).subscribe({
  //     next: (resp: PagosServicioDetalle[]) => {
  //       // this.pagosDetalles = resp;
  //       if (resp.length > 0) {
  //         //clientes que pagaron el año
  //         console.log(resp);
  //       }
  //     },
  //     error: (err) => console.log(err),
  //     complete: () => {},
  //   });
  // }

  // setClientsPayments(): void {
  //   this.costos.forEach((costo) => {
  //     this.getClientsPayment(Number(costo.cliente.idclientes), 2023);
  //   });
  // }
}
