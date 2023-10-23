import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Year } from 'src/app/models/Year.model';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
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
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  title = 'Lista de socios';
  cliente!: Cliente;
  clientes: Cliente[] = [];
  tarifa!: Tarifario;
  // clienteForm!: FormGroup;
  panel: boolean = false;
  years: Year[] = [];
  year!: Year;

  pagos: PagosServicioDetalle[] = [];
  sinPagar: any[] = [];
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
    private costoOtroService: CostoOtrosService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language,
    };
    this.listarClientes();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true,
    };
  }

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
    this.cliente = cli;
    this.panel = true;
    this.pagos = [];
    this.sinPagar = [];
  }

  cargarPagos(cliente: Cliente, yearSel: string) {
    this.cliente = cliente;
    this.year = { estado: 1, valor: yearSel };
    this.pagosServicioService
      .getDetallePagosCliente(Number(cliente.idclientes))
      .subscribe({
        next: (resp) => (this.pagos = resp),
        error: (err) => console.log(err),
        complete: () => {
          this.pagos = this.filtrarPagos(this.pagos, Number(yearSel));
          this.cargarDeudasCliente(Number(cliente.idclientes));
          // cargar costo de cliente
          this.cargarCostosCliente(Number(this.cliente.idclientes));
        },
      });
  }

  cargarDeudasCliente(idCliente: number) {
    this.deudaService.getUserDebt(idCliente).subscribe({
      next: (resp: Deuda[]) => {

        this.deudas = resp;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.sinPagar = this.mergePagos(this.pagos, this.deudas);
      },
    });
  }

  registrarDeuda(sinpago: any) {
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
        let deudaDesc: DeudaDescripcion = {
          iddeudadescripcion: 1,
          descripcion: '',
        };

        let deudaEst: DeudaEstado = {
          estado: null,
          valor: null,
          iddeudaEstado: 3,
        };

        // cargar tarifas de cliente

        let periodo: string = `${this.year.valor}-${sinpago.valor}-01`;

        let newDeuda: Deuda = {
          codigo: '0',
          periodo: moment(periodo).format('yyyy-MM-DD'),
          total: this.tarifa.monto!,
          saldo: this.tarifa.monto!,
          vencimiento: '',
          estado: 5, //agregado a deudas
          cliente: this.cliente,
          deudaDescripcion: deudaDesc,
          deudaEstado: deudaEst,
          dcto: 0.0,
        };

        console.log(newDeuda);

        // this.deudaService.saveUserDebt(newDeuda)
        // .subscribe({
        //   next: (resp)=>console.log(resp),
        //   error: err=>console.log(err),
        //   complete: ()=> {

        //     Swal.fire(
        //       'Registrado!',
        //       'La deuda fue registrada correctamente!',
        //       'success'
        //     );

        //     this.cargarPagos(this.cliente, this.year.valor);

        //   }
        // });
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

  filtrarPagos(
    pagos: PagosServicioDetalle[],
    year: number
  ): PagosServicioDetalle[] {
    let filteredPagos: PagosServicioDetalle[] = pagos.filter((item) => {
      return item.idanno == year && item.pagosServicio.tipoPagoServicios.idtipopagosservicio == 3;
    });
    return filteredPagos;
  }

  mergePagos(pagosFiltrados: PagosServicioDetalle[], deudas: Deuda[] = []) {
    // comparar con pagos
    let mesesSinPagar1: any = MESES.filter((item1) => {
      return !pagosFiltrados.some((item2) => {
        return (
          item2.idmes === item1.valor &&
          item2.pagosServicio.pagoServicioEstado.idpagoestado !== 4
        );
      });
    });

    // comparar con deudas
    let mesesSinPagar2: any = mesesSinPagar1.filter((mes:any) => {
      return deudas.some((deuda) => {
        return (
          String(deuda.periodo).slice(5,7) != String( moment(mes.valor).format('MM') ) &&
          deuda.estado != 5
        );
      });
    });

    console.log('deudas', deudas);

    deudas.forEach( (item)=> {
      console.log('año de deuda', String(item.periodo).slice(0,4));
      console.log('meses de deuda', String(item.periodo).slice(5,7));
      if (String(item.periodo).slice(5,7) == '01' ) {
        console.log('Deuda enero');
      }
    } );

    return mesesSinPagar2;
  }

  cargarCostosCliente(idCli: number) {
    this.costoService.getCostsByClient(idCli).subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
      complete: () =>
        this.obtenerTarifaCliente(Number(this.costos[0].codcosto)),
    });
  }

  obtenerTarifaCliente(costoCliente: number) {
    this.costoOtroService.getCosto_otros(costoCliente).subscribe({
      next: (resp: CostoOtroServicio[]) => {
        this.tarifa = resp[0].tarifario;
      },
      error: (error) => console.error(error)
    });
  }

  cerrarPanel() {
    // this.cliente = {};
    this.panel = false;
    this.pagos = [];
    this.sinPagar = [];
  }
}
