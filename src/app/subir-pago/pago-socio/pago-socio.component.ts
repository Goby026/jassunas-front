import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Costo } from 'src/app/models/costo.model';
import { Deuda } from 'src/app/models/deuda.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { DeudaService } from 'src/app/services/deuda.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { MESES } from 'src/app/enums/meses.data';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { VoucherService } from 'src/app/services/voucher.service';
import { VoucherDetalle } from 'src/app/models/voucherdetalle.model';
@Component({
  selector: 'app-pago-socio',
  templateUrl: './pago-socio.component.html',
})
export class PagoSocioComponent implements OnInit {
  cliente!: Cliente;
  costo!: Costo;
  nombre: string = '';
  deudas: Deuda[] = [];
  deudasSel: Deuda[] = [];
  total: number = 0;
  montoSeleccionado: number = 0;
  montoSeleccionadoSinPagar: number = 0;
  terminos: boolean = false;

  anios: number[] = [moment().year(), moment().year() + 1];
  pagados: PagosServicioDetalle[] = [];
  sinPagar: PagosServicioDetalle[] = [];
  sinPagarSel: PagosServicioDetalle[] = [];
  costoOtros: CostoOtroServicio[] = [];

  voucherDetalles: VoucherDetalle[] = [];

  tipoPago: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private costoService: CostoService,
    private deudaService: DeudaService,
    private pagosServicioService: PagosServiciosService,
    private costoOtroService: CostoOtrosService,
    private voucherService: VoucherService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const { idCliente } = this.activatedRoute.snapshot.params;
    this.cargarCliente(idCliente);
  }

  cargarCliente(id: number) {
    this.clienteService.getClientById(id).subscribe({
      next: (resp: Cliente) => (this.cliente = resp),
      error: (error) => console.log(error),
      complete: () => {
        this.nombre = `${this.cliente.nombres} ${this.cliente.apepaterno} ${this.cliente.apematerno}`;
        this.cargarDeudasCliente(Number(this.cliente.idclientes));
        // CARGAR-COSTO-CLIENTE
        this.cargarCostoCliente(Number(this.cliente.idclientes));
        this.cargarVouchersCliente(Number(this.cliente.idclientes));
      },
    });
  }

  cargarCostoCliente(idCliente: number) {
    this.costoService.getCostsByClient(idCliente).subscribe({
      next: (resp: Costo[]) => {
        this.costo = resp[0];
      },
      error: (error) => console.log(error),
      complete: () => {
        this.obtenerCostoOtroServicio(this.costo.codcosto);
      },
    });
  }

  cargarDeudasCliente(idCliente: number) {
    this.deudaService.getAllUserDebt(idCliente).subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp.filter((deuda) => {
          return (
            deuda.deudaEstado.iddeudaEstado == 3 ||
            deuda.deudaEstado.iddeudaEstado == 4
          );
        });
      },
      error: (error) => console.log(error),
      complete: () => {
        this.deudas.forEach((item) => (this.total += item.saldo));
      },
    });
  }

  setearDeuda(sel: HTMLInputElement, deuda: Deuda) {
    this.tipoPago = 1;
    if (sel.checked) {
      this.deudasSel.push(deuda);
    } else {
      this.deudasSel = this.deudasSel.filter((item) => {
        return item.idtbdeudas !== deuda.idtbdeudas;
      });
    }
    this.operar();
  }

  operar() {
    this.montoSeleccionado = 0;
    this.montoSeleccionadoSinPagar = 0;
    this.deudasSel.map((item) => (this.montoSeleccionado += item.saldo));
    this.sinPagarSel.map(
      (item) => (this.montoSeleccionadoSinPagar += Number(item.monto))
    );
  }

  siguiente() {
    if (this.deudasSel.length <= 0 && this.sinPagarSel.length <= 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Seleccione deuda/pago que desee operar',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    if (!this.terminos) {
      Swal.fire({
        title: 'Error!',
        text: '¡Debe aceptar terminos y condiciones de la plataforma!',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }

    let arrDeudasSerializado: any;

    if (this.tipoPago == 1) {
      arrDeudasSerializado = JSON.stringify(this.deudasSel);
    } else {
      arrDeudasSerializado = JSON.stringify(this.sinPagarSel);
    }

    this.router.navigate([
      '/confirmar-pago',
      arrDeudasSerializado,
      this.cliente.idclientes,
      this.tipoPago, //1:deuda | 2:pago
    ]);
  }

  verificarDeuda() {
    if (this.deudas.length > 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Para pagar adelantos, no debe tener deudas pendientes',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
      return;
    }
  }

  cargarVouchersCliente(idCliente: number){
    this.voucherService
      .getVoucherDetailsByClientId(Number(idCliente))
      .subscribe({
        next: (resp: VoucherDetalle[]) => {
          this.voucherDetalles = resp;
        },
        error: (err) => console.log(err)
      });
  }

  //* ================ CARGAR PAGOS DE CLIENTE POR AÑO ================
  verMeses(anio: any) {
    let year = Number(anio);
    this.sinPagar = [];
    this.sinPagarSel = [];
    this.tipoPago = 2;

    this.operar();

    if (anio <= 0) {
      return;
    }

    this.pagosServicioService
      .getDetallePagosClienteAnio(Number(this.cliente.idclientes), year)
      .subscribe({
        next: (resp) => {
          this.pagados = resp;
        },
        error: (error) => console.log(error),
        complete: () => {
          let newDetallePago: PagosServicioDetalle;

          let mesesSinPagar: any[] = MESES.filter((item1) => {
            return !this.pagados.some((item2) => {
              return (
                item2.idmes === item1.valor &&
                item2.pagosServicio.pagoServicioEstado.idpagoestado != 4 &&
                item2.pagosServicio.tipoPagoServicios.idtipopagosservicio === 3
              );
            });
          });

          mesesSinPagar.forEach((item) => {
            newDetallePago = {
              idmes: item.valor,
              detalletasas: '',
              idanno: anio,
              monto: this.costoOtros[0].tarifario.monto, //cargar tarifa de cliente
              cliente: this.cliente,
              pagosServicio: Object(),
              state: 1
            };

            this.sinPagar.push(newDetallePago);
          });
          this.filtrarDetallePago(anio,this.voucherDetalles, this.sinPagar);
        },
      });
  }

  // TODO: cargar los detalles de voucher que tenga registrado el cliente para validar los que estan en proceso
  filtrarDetallePago(
    anio: number,
    voucherDetalles: VoucherDetalle[],
    sinPagarDetalles: PagosServicioDetalle[]
  ) {
    let voucherDetalleFiltrado: VoucherDetalle[] = [];

    voucherDetalles.forEach((vd) => {
      if (!vd.deuda && vd.idanno == anio) {
        voucherDetalleFiltrado.push(vd);
      }
    });

    let sinPagarEnProceso: PagosServicioDetalle[] = sinPagarDetalles.filter((item1) => {
            return voucherDetalleFiltrado.some((item2) => {
              return (
                item2.idmes === item1.idmes
                // item2.pagosServicio.pagoServicioEstado.idpagoestado != 4 &&
                // item2.pagosServicio.tipoPagoServicios.idtipopagosservicio === 3
              );
            });
          });

    if(voucherDetalleFiltrado[0].voucher?.pagoServicioEstado.idpagoestado != 4){
      sinPagarDetalles.map( (item1)=> {
        sinPagarEnProceso.forEach((item2)=>{
          if(item1.idmes == item2.idmes){
            item1.state = 0
          }
        });
      })
    }

    this.sinPagar = sinPagarDetalles;
  }

  //* ================ OBTENER TARIFA DE CLIENTE ================
  obtenerCostoOtroServicio(codCosto: any) {
    this.costoOtroService.getCosto_otros(Number(codCosto)).subscribe({
      next: (resp: CostoOtroServicio[]) => {
        this.costoOtros = resp;
      },
      error: (error) => console.log(error),
    });
  }

  setearPago(sel: any, pago: PagosServicioDetalle) {
    this.tipoPago = 2;
    if (sel.checked) {
      this.sinPagarSel.push(pago);
    } else {
      this.sinPagarSel = this.sinPagarSel.filter((item) => {
        return item.idmes !== pago.idmes;
      });
    }
    this.operar();
  }

  back(): void {
    this.location.back();
  }

  resetearArreglos(){
    this.deudasSel = [];
    this.sinPagarSel = [];
  }
}
