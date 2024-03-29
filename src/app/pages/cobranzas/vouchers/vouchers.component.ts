import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { Voucher } from 'src/app/models/voucher.model';
import { VoucherDetalle } from 'src/app/models/voucherdetalle.model';
import { VoucherService } from 'src/app/services/voucher.service';
import { environment } from 'src/environments/environment';

import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { CajaService } from 'src/app/services/caja.service';
import { Caja } from 'src/app/models/caja.model';
import { Router } from '@angular/router';
import { Costo } from 'src/app/models/costo.model';
import { CostoService } from 'src/app/services/costo.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { Ticket } from '../Ticket';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { Deuda } from 'src/app/models/deuda.model';


@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
})
export class VouchersComponent implements OnInit, OnDestroy {

  // PAGINADOR* - DATATABLE
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  vouchers: Voucher[] = [];
  voucherSel!: Voucher;
  caja!: Caja;
  usuario!: Usuario;
  voucherDetalles: VoucherDetalle[] = [];
  itemsTicket: ItemTicket[] = [];
  costos!: Costo[];
  imgSel: string = '';
  total: number = 0;

  // PAGOS-SERVICIOS-DETALLES
  pagosservicio!: PagosServicio;
  detalles: PagosServicioDetalle[] = [];
  deudas: Deuda[] = [];

  constructor(
    private voucherService: VoucherService,
    private cajaService: CajaService,
    private costoService: CostoService,
    private pagosService: PagosServiciosService,
    private usuarioService: UsuarioService,
    private deudaService: DeudaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }
    this.listarVouchers();
    this.verificarEstadoCaja();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true
    }
  }

  resetAll() {
    this.voucherDetalles = [];
    this.itemsTicket = [];
    this.imgSel = '';
    this.total = 0;
  }

  verificarEstadoCaja() {
    this.cajaService.getCajaStatus().subscribe({
      next: (resp: Caja) => {
        if (resp) {
          if (resp.esta !== 1) {
            Swal.fire({
              title: 'Error!',
              text: 'Caja no esta aperturada',
              icon: 'error',
              confirmButtonText: 'Cerrar'
            });
            this.router.navigate(['/dashboard/caja']);
          } else {
            this.caja = resp;
          }
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'No hay resultados de vouchers',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
      },
      error: (error) => console.log(error),
      complete: () => {
        let username = localStorage.getItem('username') || '';
        this.usuario = this.usuarioService.getLocalUser();
      },
    });
  }

  cargarCostosCliente(idCli: number) {
    this.costoService.getCostsByClient(idCli).subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
    });
  }

  listarVouchers() {
    this.voucherService.getAllVouchers().subscribe({
      next: (resp: Voucher[]) => (this.vouchers = resp),
      error: (err) => console.log(err),
      complete: ()=> this.dtTrigger.next(null)
    });
  }

  listarDetalleVoucher() {
    this.total = 0;
    this.voucherService
      .getVoucherDetails(Number(this.voucherSel.idvoucher))
      .subscribe({
        next: (resp: VoucherDetalle[]) => {
          this.voucherDetalles = resp;
        },
        error: (err) => console.log(err),
        complete: () => {
          this.itemsTicket = [];

          this.voucherDetalles.map((item: VoucherDetalle) => {
            this.total += item.monto;
            let itemTicket: ItemTicket;

            itemTicket = {
              concepto: item.detalletasas,
              mes: item.idmes,
              monto: item.monto,
            };

            this.itemsTicket.push(itemTicket);
            this.deudas.push(item.deuda!);
          });
        },
      });
  }

  setearVoucher(v: Voucher) {
    this.voucherSel = v;
    this.listarDetalleVoucher();
    this.cargarCostosCliente(Number(v.cliente.idclientes));
  }

  async imprimirVoucher(v: Voucher) {
    this.voucherSel = v;
    this.listarDetalleVoucher();

    // console.log('voucher',v);
    // console.log('detalles', this.itemsTicket);

    setTimeout(() => {
      let reTicket: Ticket = new Ticket(
        this.voucherSel.correlativo,
        Number(this.voucherSel.cliente.idclientes),
        `${this.voucherSel.cliente.apepaterno} ${this.voucherSel.cliente.apematerno} ${this.voucherSel.cliente.nombres}`,
        this.voucherSel.cliente.direccion,
        this.voucherSel.montopagado,
        this.itemsTicket
      );

      reTicket.pagar('', 0.0, v.montoapagar);
    }, 1000);
  }

  confirmarPago() {
    if (!confirm('¿Confirmar pagos?')) {
      return;
    }

    this.voucherSel.pagoServicioEstado.idpagoestado = 1;

    this.voucherService.uploadVoucher(this.voucherSel)
    .subscribe({
      next: (v: Voucher) => {
        this.registrarPagoServicio(v);
      },
      error: (err) => console.log(err),
      complete: () => {
        // this.listarVouchers();
        this.recargarVistaVouchers();
        // registrar pagoServicio
      },
    });
  }

  registrarPagoServicio(voucher: Voucher) {
    // seteando tipo de pago
    let tipoPagoS: TipoPagoServicio = {
      descripcion: null,
      idtipopagosservicio: voucher.tipoPagoServicios.idtipopagosservicio,
    };

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1,
    };

    let pagosServicioR: PagosServicio = {
      costo: this.costos[0],
      cliente: voucher.cliente,
      montoapagar: voucher.montoapagar,
      montotasas: voucher.montotasas,
      montodescuento: voucher.montodescuento,
      montopagado: voucher.montopagado,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: null,
      caja: this.caja,
      tipoPagoServicios: tipoPagoS,
      pagoServicioEstado: tipoPagoServiciosE,
    };

    let detallesR: PagosServicioDetalle[] =
      this.setDetallesPagos(pagosServicioR);

    this.pagosService
      .savePagosAndDetalles(pagosServicioR, detallesR)
      .subscribe({
        next: (resp: any) => {
          let { pagosservicio, detalles } = resp;

          this.pagosservicio = pagosservicio;
          this.detalles = detalles;
        },
        error: (error) => console.error(error),
        complete: () => {
          // TODO: ACTUALIZAR ESTADO DE DEUDA
          if(voucher.tipoPagoServicios.idtipopagosservicio == 1){
            this.actualizarDeudas(2);
          }

          const ticket: Ticket = new Ticket(
            Number(this.pagosservicio.correlativo),
            Number(this.pagosservicio.cliente.idclientes),
            `${this.pagosservicio.cliente.apepaterno} ${this.pagosservicio.cliente.apematerno} ${this.pagosservicio.cliente.nombres}`,
            this.pagosservicio.cliente.direccion,
            this.pagosservicio.montopagado,
            this.itemsTicket
          );

          this.listarVouchers();
          ticket.pagar('', 0.0, this.pagosservicio.montopagado);
        },
      });
  }

  // metodo para registrar los detalles del pago (tabla dependiente)
  setDetallesPagos(pagoServicio: PagosServicio): PagosServicioDetalle[] {
    let pagosServicioDeta: PagosServicioDetalle;
    let itemTicket: ItemTicket;
    let pagServDetalles: PagosServicioDetalle[] = [];

    this.voucherDetalles.map((itemPago) => {
      pagosServicioDeta = {
        idcabecera: 1,
        idmes: itemPago.idmes,
        detalletasas: itemPago.detalletasas,
        idanno: itemPago.idanno,
        monto: itemPago.monto,
        cliente: this.voucherSel.cliente,
        pagosServicio: pagoServicio,
      };
      itemTicket = {
        concepto: itemPago.detalletasas,
        mes: itemPago.idmes,
        monto: itemPago.monto,
      };

      pagServDetalles.push(pagosServicioDeta);
      this.itemsTicket.push(itemTicket); //ticket
    });

    return pagServDetalles;
  }

  recargarLista(e: HTMLInputElement) {
    if (e.value.length <= 0 || e.value === '') {
      this.listarVouchers();
    }
  }

  buscarVoucher(e: HTMLInputElement) {
    // console.log(e.value)
    this.voucherService.getVoucherByCliente(e.value).subscribe({
      next: (resp: Voucher[]) => {
        this.vouchers = resp;
      },
      error: (error) => console.log(error),
    });
  }

  confimarAnulacion(voucher: Voucher): void {
    if (!confirm('¿Anular voucher seleccionado?')) {
      return;
    }

    let pagoServEstado: PagoServicioEstado = {
      idpagoestado: 4,
      descripcion: null,
    };
    let mofidifiedVoucher: Voucher = {
      ...voucher,
      montopagado: 0,
      pagoServicioEstado: pagoServEstado,
    };

    this.voucherService.updateVoucher(mofidifiedVoucher).subscribe({
      next: (resp: Voucher) => {
        if (
          resp.idvoucher != 0 ||
          resp.idvoucher != null ||
          resp.idvoucher != undefined
        ) {
          Swal.fire({
            title: 'Operación correcta!',
            text: `Voucher ${resp.correlativo} anulado correctamente!`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error) => console.log(error),
      complete: () => {
        // TODO: ACTUALIZAR ESTADO DE DEUDA
        if(voucher.tipoPagoServicios.idtipopagosservicio == 1){
          this.actualizarDeudas(3);
        }

        this.recargarVistaVouchers();
      },
    });
  }

  recargarVistaVouchers(): void {
    this.router
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/dashboard/vouchers']);
      });
  }

  actualizarDeudas(deudaEstado: number) {
    this.deudas.map((item) => {
      item.observacion = 'UPDATED';
      item.deudaEstado.iddeudaEstado = deudaEstado;
      return item;
    });
    this.deudaService.updateUserDebts(this.deudas).subscribe({
      next: (resp: Deuda[]) => {
        console.log('UPDATED: ', resp);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
