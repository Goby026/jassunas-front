import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Caja } from 'src/app/models/caja.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { CajaService } from 'src/app/services/caja.service';
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
  totalCajaSel: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagoServicios: PagosServiciosService,
    private cajaService: CajaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language,
    };

    this.defParametros();

    this.seguimiento(this.idcaja);
    this.cargarCaja(this.idcaja);
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
        console.log(this.idcaja);

        //this.obtenerClientePorId(this.idcaja);
      },
      error: (error) => console.log(error),
    });
  }

  cargarCaja(id: number): void {
    this.cajaService.getCajaById(id).subscribe({
      next: (item) => {
        this.caja = item;
      },
      error: (error) => console.log(error),
    });
  }

  seguimiento(id: any): void {
    // this.panelSeguimiento = false;

    this.totalCajaSel = 0;
    // this.panelSeguimiento = true;
    this.pagoServicios.tracking(id).subscribe({
      next: (resp: any) => {
        // console.log('RESP--->', resp.pagosservicios);
        this.pagosservicios = resp.pagosservicios;
        // this.caja.idcaja = id;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.pagosservicios.map((item: PagosServicio) => {
          this.totalCajaSel += item.montopagado;
        });

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
        this.recargarTarifas();

        // this.seguimiento(pago.caja.idcaja);
      },
    });
  }

  recargarTarifas() {
    this.router
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([`/dashboard/seguimiento/${this.idcaja}`]);
      });
  }
}
