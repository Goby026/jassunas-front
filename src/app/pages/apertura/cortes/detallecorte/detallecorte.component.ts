import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import * as moment from 'moment';
import 'moment/locale/es';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaDescripcion } from 'src/app/models/deudadescripcion.model';
import { DeudaEstado } from 'src/app/models/deudaestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { environment } from 'src/environments/environment';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { CorteDetalle } from 'src/app/models/cortedetalle.model';
import { Corte } from 'src/app/models/corte.model';
import { CorteService } from 'src/app/services/corte.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
moment.locale('es');

@Component({
  selector: 'app-detallecorte',
  templateUrl: './detallecorte.component.html',
})
export class DetallecorteComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  deudas: Deuda[] = [];
  pagos: PagosServicio[] = [];
  clientes: Cliente[] = [];
  mes = moment().format('MMMM');
  year = moment().format('yyyy');
  total: number = 0.0;
  porcentaje: number = 0.0;

  costosOtros: CostoOtroServicio[] = [];

  constructor(
    private deudaService: DeudaService,
    private costoOtrosService: CostoOtrosService,
    private corteService: CorteService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language,
    };
    setTimeout(() => {
      this.getData();
    }, 4000);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true,
    };
  }

  getData() {
    this.deudaService.generateDebt().subscribe({
      next: (resp: any) => {
        this.pagos = resp.pagos.filter((pago: PagosServicio) => {
          return (
            pago.tipoPagoServicios.idtipopagosservicio == 3 &&
            pago.pagoServicioEstado.idpagoestado == 1
          );
        });
      },
      error: (err) => console.log(err),
      complete: () => {
        this.obtenerCostosOtros();
      },
    });
  }

  obtenerCostosOtros(): void {
    let costos: CostoOtroServicio[] = [];
    this.costoOtrosService.getAllCostoOtros().subscribe({
      next: (resp) => {
        costos = resp;
      },
      error: (err) => console.log(err),
      complete: () => {
        this.deudas = this.setDebtsArray(costos, this.pagos);
        this.deudas.map((item) => {
          this.total += item.total;
        });
        this.dtTrigger.next(null);
      },
    });
  }

  setDebtsArray(
    costosOtros: CostoOtroServicio[],
    pagosFiltrados: PagosServicio[] = []
  ): Deuda[] {
    let deudas: Deuda[] = [];

    let clientesA: Cliente[] = [];
    let costos: CostoOtroServicio[] = [];

    let dd: DeudaDescripcion = {
      iddeudadescripcion: 1,
      descripcion: '',
    };

    let de: DeudaEstado = {
      iddeudaEstado: 3,
      estado: '',
      valor: '',
    };

    if (pagosFiltrados.length > 0) {
      pagosFiltrados.forEach((pago) => {
        clientesA.push(pago.cliente);
      });

      costos = costosOtros.filter((item1) => {
        return clientesA.some((item2) => {
          return item1.costo.codcosto !== item2.idclientes;
        });
      });
    } else {
      costos = costosOtros;
    }

    // GENERAR DEUDA POR CADA CLIENTE QUE NO PAGO EN ESTE CORTE DE MES

    costos = costos.filter(
      (item) =>
        item.costo.cliente.apepaterno != null ||
        item.costo.cliente.nombres != null
    );

    costos.forEach((c) => {
      let deuda: Deuda = {
        cliente: c.costo.cliente,
        codigo: '1',
        deudaDescripcion: dd,
        deudaEstado: de,
        periodo: new Date(),
        saldo: c.tarifario.monto!,
        total: c.tarifario.monto!,
        dcto: 0,
        vencimiento: new Date(),
        estado: 1,
        observacion: 'Generado automáticamente por corte',
      };
      deudas.push(deuda);
    });

    return deudas;
  }

  regCorte(): void {
    if (!confirm('¿Registrar Corte de Mes?')) {
      return;
    }
    // registrar Corte
    let corte: Corte = {
      deuda: this.total,
      pagado: 0,
      totalcobrar: this.total,
      usuario: this.usuarioService.getLocalUser(),
    };
    this.corteService.saveCorte(corte).subscribe({
      next: (resp) => {
        corte = resp;
      },
      error: (err) => console.log(err.message),
      complete: () => this.regCorteDetalle(corte),
    });
  }

  regCorteDetalle(corte: Corte): void {
    let detallesCorte: CorteDetalle[] = [];

    this.deudas.forEach((item) => {
      let detCorte: CorteDetalle = {
        cliente: item.cliente,
        codigo: 'DET-CORTE',
        corte: corte,
        dcto: item.dcto,
        estado: item.estado,
        periodo: item.periodo,
        saldo: item.saldo,
        total: item.total,
        vencimiento: item.vencimiento,
      };

      detallesCorte.push(detCorte);
    });

    this.corteService.saveCorteDetallesAll(detallesCorte).subscribe({
      next: (resp) => console.log(resp),
      error: (err) => console.log(err.message),
      complete: () => {
        alert('Se registro el corte correctamente');
        this.router.navigate(['/dashboard/caja/cortes']);
      },
    });
  }
}
