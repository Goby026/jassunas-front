import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Caja } from 'src/app/models/caja.model';
import { Egreso } from 'src/app/models/egreso.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { CajaService } from 'src/app/services/caja.service';
import { EgresoService } from 'src/app/services/egreso.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styles: [],
})
export class SeguimientoComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  idcaja!: number;
  caja!: Caja;
  pagosservicios: PagosServicio[] = [];
  // totalCajaSel: number = 0;

  egresos: Egreso[] = [];

  totalEgresos: number = 0;
  balance: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagoServicios: PagosServiciosService,
    private cajaService: CajaService,
    private egresoService: EgresoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language,
    };

    this.defParametros();

    this.cargarCaja(this.idcaja);
    this.seguimiento(this.idcaja);
    this.egresosPorCaja(Number(this.idcaja));
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true,
    };
  }

  defParametros(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.idcaja = params['idcaja'];
      },
      error: (error) => console.log(error)
    });
  }

  cargarCaja(id: number): void {
    this.cajaService.getCajaById(id).subscribe({
      next: (item) => {
        this.caja = item;
      },
      error: (error) => console.log(error),
      complete: ()=> {
        // DEFINIR BALANCE
        this.balance = (this.caja.total - this.caja.totalefectivo);
      }
    });
  }

  seguimiento(id: any): void {
    this.pagoServicios.tracking(id).subscribe({
      next: (resp: any) => {
        this.pagosservicios = resp.pagosservicios;
      },
      error: (error) => console.log(error),
      complete: () => {

        this.dtTrigger.next(null);
      },
    });
  }

  anularTicket(pago: PagosServicio): void {
    if (!confirm(`¿Anular ticket ${pago.correlativo} ?`)) {
      return;
    }

    let pagoServEstado: PagoServicioEstado = {
      idpagoestado: 4,
      descripcion: null,
    };

    let pagoToUpdate: PagosServicio = {
      ...pago,
      montopagado: 0.0,
      montotasas: 0.0,
      montodescuento: 0.0,
      esta: 4,
      pagoServicioEstado: pagoServEstado,
    };

    this.pagoServicios.updatePagosServicio(pagoToUpdate).subscribe({
      next: (resp: PagosServicio) => {
        if (resp.id != 0 || resp.id != null || resp.id != undefined) {
          alert(`Pago ${resp.correlativo} anulado correctamente!`);
        }
        console.log(resp);
      },
      error: (error) => console.log(error),
      complete: () => {
        this.recargarSeguimiento();
      },
    });
  }

  anularEgreso(egreso: Egreso){
    if (!confirm(`¿Anular egreso ${egreso.idegreso} ?`)) {
      return;
    }

    // let pagoServEstado: PagoServicioEstado = {
    //   idpagoestado: 4,
    //   descripcion: null,
    // };

    let egresoToUpdate: Egreso = {
      ...egreso,
      importe: 0.0,
      estado: 0
    };

    this.egresoService.update(egresoToUpdate).subscribe({
      next: (resp: Egreso) => {
        if (resp.idegreso != 0 || resp.idegreso != null || resp.idegreso != undefined) {
          alert(`Egreso ${resp.idegreso} anulado correctamente!`);
        }
      },
      error: (error) => console.log(error),
      complete: () => {
        // this.egresosPorCaja(egreso.caja.idcaja!);
        this.recargarSeguimiento();
      },
    });

  }

  egresosPorCaja( id: number ){
    this.egresoService.getAllByCaja( id )
    .subscribe({
      next: (resp: Egreso[])=>{
        this.egresos = resp;
      },
      error: (err) => console.log(err),
      complete: ()=>{
        this.egresos.map( (item)=> {
          this.totalEgresos = this.totalEgresos + Number(item.importe);
        });

        this.balance = this.balance - this.totalEgresos;

      }
    });
  }

  recargarSeguimiento() {
    this.router
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([`/dashboard/seguimiento/${this.idcaja}`]);
      });
  }
}
