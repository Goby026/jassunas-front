import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Deuda } from '../models/deuda.model';
import { PagosServicio } from '../models/pagosservicio.model';
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

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
})
export class ConfirmacionComponent implements OnInit {
  pagos!: Deuda[]; // ARREGLO DE DEUDAS
  idcliente: number = 0;
  pagoServicio!: PagosServicio;
  correlativo: number = 0;
  monto: number = 0;
  fecha: string = moment().format('DD-MM-YYYY hh:mm a');
  cliente!:Cliente;
  regVoucher!: Voucher;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagosServicios: PagosServiciosService,
    private voucherService: VoucherService,
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setParametros();
  }

  setParametros() {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        const arregloSerializado = params['arrDeudas'];
        this.idcliente = params['idcliente'];
        this.pagos = JSON.parse(arregloSerializado);
        this.setearData();
      },
      error: (error) => console.log(error),
      complete: () => {
        console.log('finalizado');
      },
    });
  }

  setearData() {
    this.pagosServicios.getContador().subscribe({
      next: (resp) => {
        this.correlativo = resp;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.pagos.map( (item)=>{
          this.monto += item.saldo;
        });
        this.getCliente();
      },
    });
  }

  getCliente(){
    this.clienteService.getClientById(this.idcliente)
    .subscribe({
      next: (resp:Cliente) => {
        this.cliente = resp;
      },
      error: (error) => console.log(error)
    });
  }

  registrarVoucher(){

    if(!confirm("¿Registrar pagos?")){
      return;
    }

    let nombreCompleto: string = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;

    let pagoEstado: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 2
    }

    let tipoPago: TipoPagoServicio={
      descripcion: null,
      idtipopagosservicio: 1
    }


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
    }

    let voucherDetalles: VoucherDetalle[] = this.registrarDetalleVoucher(voucher);

    console.log('VOUCHER-------------------------->', voucher);

    this.voucherService.saveVoucherAndDetalles(voucher, voucherDetalles)
    .subscribe({
      next: (resp:any) => {
        this.regVoucher = resp;
      },
      error: (error) => {alert(error.message)},
      complete: () => {
        let voucherRegistrado = JSON.stringify(this.regVoucher);
        this.router.navigate(['/upload-pago', voucherRegistrado]);
      }
    });

    /*
    this.voucherService.saveVoucher(voucher)
    .subscribe({
      next: (resp:Voucher) => {
        this.regVoucher = resp;
        this.registrarDetalleVoucher(resp);
      },
      error: error => console.log(error),
      complete: () => {
        let voucherRegistrado = JSON.stringify(this.regVoucher);
        this.router.navigate(['/upload-pago', voucherRegistrado]);
      }
    });
    */
  }

  registrarDetalleVoucher(v: Voucher) {
    let voucherDetalle: VoucherDetalle;
    let voucherDetalles: VoucherDetalle[]=[];

    this.pagos.map( (item)=> {
      voucherDetalle = {
        detalletasas: 'MANTENIMIENTO',
        periodo: item.periodo,
        idmes: moment(item.periodo).month() + 1,
        idanno: moment(item.periodo).year(),
        monto: item.total,
        voucher: v,
        pagosServicio: null,
      }

      voucherDetalles.push(voucherDetalle);
    });

    return voucherDetalles;

    // this.voucherService.saveVoucherDetail(voucherDetalles)
    // .subscribe({
    //   next: voucherDetalles => {
    //     console.log(voucherDetalles);
    //   },
    //   error: error=> console.log(error),
    //   complete: ()=> console.log('Detalles registrados')
    // });
  }

  // actualizarEstadoDeuda(){
  //   let estadodeuda : DeudaEstado = {
  //     iddeudaEstado : 4,
  //     estado: null,
  //     valor: null
  //   }
  //   let update_deudas: Deuda[] = this.pagos.map( ( deuda: Deuda )=> {

  //     deuda.deudaEstado = estadodeuda

  //     return deuda as Deuda;
  //   } );

  //   this.deudaService.updateUserDebts(update_deudas)
  //   .subscribe({
  //     next: (resp)=>console.log(resp),
  //     error: (error)=>console.log('ERROR', error)
  //   });

  // }
}
