import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Year } from 'src/app/models/Year.model';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { YearsService } from 'src/app/services/years.service';
import { MESES } from '../../enums/meses.data';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { DeudaDescripcion } from 'src/app/models/deudadescripcion.model';
import { DeudaEstado } from 'src/app/models/deudaestado.model';
import { CostoService } from 'src/app/services/costo.service';
import { Costo } from 'src/app/models/costo.model';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { Tarifario } from 'src/app/models/tarifario.model';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment/locale/es';
import { Router } from '@angular/router';
moment.locale('es');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  title = 'MODULO DE GESTION DIRECTA DE DEUDAS';
  cliente!: Cliente;
  clientes: Cliente[] = [];
  tarifa!: Tarifario;
  panel: boolean = false;
  years: Year[] = [];
  year!: Year;

  pagos: PagosServicioDetalle[] = [];
  deudas: Deuda[] = [];
  costos: Costo[] = [];

  // PAGINADOR
  page: number = 1;
  count: number = 0;
  tableSize: number = 15;
  tableSizes: number[] = [5, 10, 15, 20];

  constructor(
    private clienteService: ClienteService,
    private pagosServicioService: PagosServiciosService,
    private yearService: YearsService,
    private deudaService: DeudaService,
    private costoService: CostoService,
    private costoOtroService: CostoOtrosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language,
    };
    // this.listarClientes();
    this.listarDeudas();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true,
    };
  }

  listarDeudas(): void {
    this.deudaService.getAllDebts().subscribe({
      next: (resp) => (this.deudas = resp),
      error: (err) => console.log(err),
      complete: () => {
        this.dtTrigger.next(null);
      },
    });
  }

  // filtrar($event: any, sel: string): void {
  //   if ($event) {
  //     this.deudaService.geDebtsByYear(Number(sel)).subscribe({
  //       next: (resp) => {
  //         this.deudas = resp;
  //       },
  //       error: (err) => console.log(err),
  //       complete: () => {
  //         this.router
  //           .navigateByUrl('/dashboard', { skipLocationChange: true })
  //           .then(() => {
  //             this.router.navigate(['/dashboard/administrador']);
  //           });
  //         this.dtTrigger.next(null);
  //       },
  //     });
  //   }
  // }

  listarClientes(): void {
    this.clienteService.listClients().subscribe({
      next: (resp: Cliente[]) => {
        this.clientes = resp.filter((item) => item.estado != 0);
      },
      error: (error) => console.log('ERROR->', error),
      complete: () => {
        this.dtTrigger.next(null);
        this.cargarYears();
      },
    });
  }

  mostrarCliente(cli: Cliente) {
    this.cerrarPanel();
    if (cli) {
      this.cargarCostosCliente(Number(cli.idclientes));
      this.cliente = cli;
      this.panel = true;
      this.pagos = [];
      this.year = undefined!;
    } else {
      alert('cliente no válido');
    }
  }

  cargarPagos(cliente: Cliente, yearSel: string) {
    this.cliente = cliente;
    this.year = { estado: 1, valor: yearSel };
    this.pagosServicioService
      .getDetallePagosCliente(Number(cliente.idclientes))
      .subscribe({
        next: (resp) => {
          this.pagos = resp.filter((item) => {
            return String(item.idanno) === String(yearSel);
          });
        },
        error: (err) => console.log(err),
        complete: () => {
          this.deudas = this.filtrarDeudasConPagos(this.pagos, this.deudas);
        },
      });
  }

  filtrarDeudasConPagos(
    pagosFiltrados: PagosServicioDetalle[],
    deudas: Deuda[]
  ): Deuda[] {
    let deudasFiltradasPagos: Deuda[] = deudas.filter((item1) => {
      return !pagosFiltrados.some((item2) => {
        return (
          `${item2.idanno}-${moment(String(item2.idmes)).format('MM')}` ===
          String(item1.periodo).slice(0, 7)
        );
      });
    });

    return deudasFiltradasPagos;
  }

  cargarDeudasCliente(cli: Cliente, yearSel: string) {
    this.deudaService.getUserDebt(Number(cli.idclientes)).subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp.filter((item) => {
          return String(item.periodo).slice(0, 4) === yearSel;
        });
      },
      error: (error) => console.log(error),
      complete: () => {
        this.cargarCostosCliente(Number(this.cliente.idclientes));
        console.log(this.deudas);
      },
    });
  }

  setearYear(yearSel: string) {
    this.year = { estado: 1, valor: yearSel };
    this.cargarDeudasCliente(this.cliente, yearSel);
  }

  verDeudas() {
    if (!this.year) {
      return;
    }
    this.generarDeudas(this.deudas);
    this.year = undefined!;
  }

  generarDeudas(deudasFiltered: Deuda[]) {
    let newDeudas: Deuda[] = [];

    let deudaDesc: DeudaDescripcion = {
      iddeudadescripcion: 1,
      descripcion: 'Deuda',
    };

    let deudaEst: DeudaEstado = {
      estado: 'DEUDA',
      valor: 'debt',
      iddeudaEstado: 3,
    };

    MESES.forEach((item) => {
      let newDeuda: Deuda = {
        codigo: '',
        periodo: `${this.year.valor}-${moment(String(item.valor)).format(
          'MM'
        )}-02`,
        total: this.tarifa.monto!,
        saldo: this.tarifa.monto!,
        vencimiento: '',
        estado: 1,
        cliente: this.cliente,
        deudaDescripcion: deudaDesc,
        deudaEstado: deudaEst,
        dcto: 0,
      };
      newDeudas.push(newDeuda);
    });

    this.deudas = newDeudas.filter((item1) => {
      return !deudasFiltered.some((item2) => {
        return (
          String(item2.periodo).slice(0, 7) ===
          String(item1.periodo).slice(0, 7)
        );
      });
    });

    console.log(this.deudas);

    this.cargarPagos(this.cliente, this.year.valor);
  }

  registrarDeuda(deudaSelected: Deuda) {
    Swal.fire({
      title: '¿Registrar deuda?',
      text: 'No se podra revertir luego!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, registrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        deudaSelected.periodo = moment(deudaSelected.periodo)
          .add(5, 'days')
          .format('yyyy-MM-DD');

        this.deudaService.saveUserDebt(deudaSelected).subscribe({
          next: (resp) => console.log(resp),
          error: (err) => console.log(err),
          complete: () => {
            // Swal.fire(
            //   'Registrado!',
            //   'La deuda fue registrada correctamente!',
            //   'success'
            // );
            this.pagos = [];
            this.deudas = [];

            this.cargarDeudasCliente(this.cliente, this.year.valor);
          },
        });
      } else {
        return;
      }
    });
  }

  registrarVarias() {
    if (this.deudas.length <= 0) {
      alert('No hay deudas para registrar');
      return;
    }

    Swal.fire({
      title: '¿Registrar todas las deudas?',
      text: 'No se podra revertir luego!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, registrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deudaService.saveAllUserDebt(this.deudas).subscribe({
          next: (resp: Deuda[]) => {
            console.log('deudas registradas: ' + resp);
          },
          error: (err) => console.log(err),
          complete: () => (this.deudas = []),
          // this.cargarDeudasCliente(this.cliente, this.year.valor),
        });
      } else {
        return;
      }
    });
  }

  cargarYears() {
    this.yearService.getYears().subscribe({
      next: (resp) => (this.years = resp.filter((res) => res.estado != 0)),
      error: (err) => console.log(err),
    });
  }

  cargarCostosCliente(idCli: number) {
    this.costoService.getCostsByClient(idCli).subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.obtenerTarifaCliente(Number(this.costos[0].codcosto));
      },
    });
  }

  obtenerTarifaCliente(costoCliente: number) {
    this.costoOtroService.getCosto_otros(costoCliente).subscribe({
      next: (resp: CostoOtroServicio[]) => {
        this.tarifa = resp[0].tarifario;
      },
      error: (error) => console.error(error),
    });
  }

  cerrarPanel() {
    // this.cliente = {};
    this.panel = false;
    this.pagos = [];
    this.deudas = [];
    this.year = undefined!;
  }
}
