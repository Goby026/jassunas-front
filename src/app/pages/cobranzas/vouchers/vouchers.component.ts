import { Component, OnInit } from '@angular/core';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { Voucher } from 'src/app/models/voucher.model';
import { VoucherDetalle } from 'src/app/models/voucherdetalle.model';
import { VoucherService } from 'src/app/services/voucher.service';


import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
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
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit {

  vouchers: Voucher[] = [];
  voucherSel!: Voucher;
  caja!: Caja;
  usuario!: Usuario;
  voucherDetalles: VoucherDetalle[] = [];
  itemsTicket: ItemTicket[] = [];
  costos!: Costo[];
  imgSel: string = '';
  total: number = 0;

  constructor(
    private voucherService: VoucherService,
    private cajaService: CajaService,
    private costoService: CostoService,
    private pagosService: PagosServiciosService,
    private usuarioService: UsuarioService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.listarVouchers();
    this.verificarEstadoCaja();
  }

  verificarEstadoCaja() {
    this.cajaService.getCajaStatus().subscribe({
      next: (resp: Caja) => {
        if (resp.esta !== 1) {
          alert('Caja no esta aperturada');
          this.router.navigate(['/dashboard/caja']);
        } else {
          this.caja = resp;
        }
      },
      error: (error) => console.log(error),
      complete: ()=> {
        let username = localStorage.getItem('username') || '';
        this.usuario = this.usuarioService.getLocalUser();
      }
    });
  }

  cargarCostosCliente(idCli: number){
    this.costoService.getCostsByClient(idCli)
    .subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
    });
  }


  listarVouchers(){
    this.voucherService.getAllVouchers()
     .subscribe({
      next: (resp: Voucher[])=>this.vouchers = resp,
      error: (err)=>console.log(err),
      complete: ()=>console.log(this.vouchers)
     });
  }

  listarDetalleVoucher(){
    this.total = 0;
    this.voucherService.getVoucherDetails( Number(this.voucherSel.idvoucher))
    .subscribe({
      next: (resp: VoucherDetalle[])=> {
        this.voucherDetalles = resp;
        this.voucherDetalles.map( (item:VoucherDetalle)=> {
          this.total += item.monto;
        } );
      },
      error: (err)=>console.log(err),
      complete: ()=>console.log(this.voucherDetalles)
     });
  }

  setearVoucher(v : Voucher){
    this.voucherSel = v;
    this.listarDetalleVoucher();
    this.cargarCostosCliente(Number(v.cliente.idclientes));
  }

  confirmarPago(){
    if(!confirm('¿Confirmar pagos?')){
      return;
    }

    this.voucherSel.pagoServicioEstado.idpagoestado = 1;

    this.voucherService.uploadVoucher(this.voucherSel)
    .subscribe({
      next: (resp: Voucher)=> console.log(resp),
      error: (err)=>console.log(err),
      complete: ()=> {
        this.listarVouchers();
        // registrar pagoServicio
      }
    });
  }


  registrarPagoServicio(voucher: Voucher){
    // seteando tipo de pago
    let tipoPagoS: TipoPagoServicio = {
      descripcion: null,
      idtipopagosservicio: 1
    }

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1
    }

    let pagosServicioR: PagosServicio = {
      costo: this.costos[0],
      cliente: this.voucherSel.cliente,
      montoapagar: this.total,
      montotasas: 0,
      montodescuento: 0,
      montopagado: this.total,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: null,
      caja: this.caja,
      tipoPagoServicios: tipoPagoS,
      pagoServicioEstado: tipoPagoServiciosE
    }

    this.pagosService.savePagoServicio(pagosServicioR)
    .subscribe({
      next:( resp: PagosServicio )=>{
        this.regPagosDetalle(resp);

        // CREANDO EL TICKET [✔]
        const ticket: Ticket = new Ticket(
          resp.correlativo,
          Number(this.voucherSel.cliente.idclientes),
          `${resp.cliente.apepaterno} ${resp.cliente.apematerno} ${resp.cliente.nombres}`,
          resp.cliente.direccion,
          this.total,
          this.itemsTicket);

        ticket.pagar();
      },
      error: error => console.log(error),
      complete: ()=>{
        // this.anio = 0;
        this.itemsTicket = [];
      }
    });
  }

    // metodo para registrar los detalles del pago (tabla dependiente)
    regPagosDetalle(pagoServicio: PagosServicio) {
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
          fecha: itemPago.periodo,
          monto: itemPago.monto,
        }

        pagServDetalles.push(pagosServicioDeta);
        this.itemsTicket.push(itemTicket);
      });

      this.pagosService.savePagosServicioDetalle(pagServDetalles).subscribe({
        next: (resp) => {
          console.log('Detalles', resp);
        },
        error: (error) => console.log(error),
        complete: () => console.log('Detalles registrados'),
      });
    }


    // probarRegistro(){
    //   this.voucherService.saveVoucherAndDetalles(this.voucherSel, this.voucherDetalles)
    //   .subscribe({
    //     next: (resp) => {
    //       console.log(resp)
    //     },
    //     error: (error) => console.log(error)
    //   });
    // }

}
