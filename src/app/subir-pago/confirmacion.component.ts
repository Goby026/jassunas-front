import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Deuda } from '../models/deuda.model';
import { PagosServiciosService } from '../services/pagos-servicios.service';
import { VoucherService } from '../services/voucher.service';
import { Voucher } from '../models/voucher.model';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';
import { PagoServicioEstado } from '../models/pagoservicioestado.model';
import { TipoPagoServicio } from '../models/tipopagoservicio.model';
import { VoucherDetalle } from '../models/voucherdetalle.model';
import { DeudaEstado } from '../models/deudaestado.model';
import { DeudaService } from '../services/deuda.service';
import { PagosServicioDetalle } from '../models/pagosserviciodeta.model';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
})
export class ConfirmacionComponent implements OnInit {
  deudas!: Deuda[]; // ARREGLO DE DEUDAS
  pagos: PagosServicioDetalle[] = [];
  idcliente: number = 0;
  tipoPago: number = 1; // 1: deuda | 2: pagoServicio
  correlativo: number = 0;
  monto: number = 0;
  fecha: string = moment().format('DD-MM-YYYY hh:mm a');
  cliente!: Cliente;
  regVoucher!: Voucher;
  arregloSerializado: any;
  titulo: string = 'DEUDA';

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagosServicios: PagosServiciosService,
    private voucherService: VoucherService,
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setParametros();
  }

  setParametros() {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.arregloSerializado = params['arrDeudas'];
        this.idcliente = params['idcliente'];
        this.tipoPago = params['tipopago'];
        this.setearData(this.tipoPago);
      },
      error: (error) => console.log(error)
    });
  }

  setearData(tipoPago: number) {
    this.pagosServicios.getContador().subscribe({
      next: (resp) => {
        this.correlativo = resp;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (tipoPago == 1) {
          // 1 : setear deuda
          this.deudas = JSON.parse(this.arregloSerializado);
          this.deudas.map((item) => {
            this.monto += item.saldo;
          });
        } else {
          // 2 : setear pago
          this.titulo = 'PAGO';
          this.pagos = JSON.parse(this.arregloSerializado);
          this.pagos.map((item) => {
            this.monto += item.monto!;
          });
        }

        this.getCliente();
      },
    });
  }

  getCliente() {
    this.clienteService.getClientById(this.idcliente).subscribe({
      next: (resp: Cliente) => {
        this.cliente = resp;
      },
      error: (error) => console.log(error),
    });
  }

  botonConfirmar() {
    Swal.fire({
      title: '¿Registrar pagos?',
      text: 'No podrá revertir el pago luego!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.registrarVoucher();
      } else {
        return;
      }
    });
  }

  registrarVoucher() {
    let nombreCompleto: string = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;

    let pagoEstado: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 2,
    };

    let tipoPago: TipoPagoServicio = {
      descripcion: null,
      idtipopagosservicio: this.tipoPago == 1 ? 1 : 3,
    };

    let voucher: Voucher = {
      cliente: this.cliente,
      montoapagar: this.monto,
      montotasas: 0,
      montodescuento: 0,
      montopagado: this.monto,
      fecha: moment().toDate(),
      usuaCrea: nombreCompleto,
      imagen: '',
      correlativo: this.correlativo,
      pagoServicioEstado: pagoEstado,
      tipoPagoServicios: tipoPago,
    };

    let voucherDetalles: VoucherDetalle[] =
      this.registrarDetalleVoucher(voucher);

    this.voucherService
      .saveVoucherAndDetalles(voucher, voucherDetalles)
      .subscribe({
        next: (resp: any) => {
          this.regVoucher = resp;
        },
        error: (error) => {
          alert(error.message);
        },
        complete: () => {
          if (this.tipoPago == 1 ) {
            this.actualizarEstadoDeuda();
          }
          let voucherRegistrado = JSON.stringify(this.regVoucher);
          this.router.navigate(['/upload-pago', voucherRegistrado]);
        },
      });
  }

  registrarDetalleVoucher(v: Voucher) {
    let voucherDetalle: VoucherDetalle;
    let voucherDetalles: VoucherDetalle[] = [];

    if (this.tipoPago == 1) { //deudas
      this.deudas.map((item) => {
        voucherDetalle = {
          detalletasas: 'PAGO-DEUDA',
          periodo: item.periodo,
          idmes: moment(item.periodo).month() + 1,
          idanno: moment(item.periodo).year(),
          monto: item.total,
          voucher: v,
          pagosServicio: null,
          deuda: item,
        };
        voucherDetalles.push(voucherDetalle);
      });

    }else{ //pagos
      this.pagos.map((item) => {
        voucherDetalle = {
          detalletasas: 'PAGO-MANTENIMIENTO',
          periodo: new Date(`${item.idanno}-${item.idmes}-01`),
          idmes: Number(item.idmes),
          idanno: item.idanno,
          monto: Number(item.monto),
          voucher: v,
          pagosServicio: null,
          deuda: null,
        };
        voucherDetalles.push(voucherDetalle);
      });
    }
    return voucherDetalles;
  }

  actualizarEstadoDeuda() {
    let estadodeuda: DeudaEstado = {
      iddeudaEstado: 4,
      estado: null,
      valor: null,
    };
    let update_deudas: Deuda[] = this.deudas.map((deuda: Deuda) => {
      deuda.deudaEstado = estadodeuda;

      return deuda;
    });

    this.deudaService.updateUserDebts(update_deudas).subscribe({
      next: (resp) => console.log(resp),
      error: (error) => console.log('ERROR', error),
    });
  }
}
