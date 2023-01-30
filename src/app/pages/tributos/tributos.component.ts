import { Component, Input, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { RequisitoService } from 'src/app/services/requisito.service';
import { TributoService } from 'src/app/services/tributo.service';
import { TupaService } from 'src/app/services/tupa.service';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { TributoDetalle } from 'src/app/models/tributoDetalle.model';
import { Requisito } from 'src/app/models/requisito.model';
import { Tributo } from 'src/app/models/tributo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Tupa } from 'src/app/models/tupa.model';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { CostoService } from 'src/app/services/costo.service';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { Costo } from 'src/app/models/costo.model';
import { Caja } from 'src/app/models/caja.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { Ticket } from '../cobranzas/Ticket';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';


@Component({
  selector: 'app-tributos',
  templateUrl: './tributos.component.html',
  styleUrls: ['./tributos.component.css']
})
export class TributosComponent implements OnInit {

  tupas: Tupa[] = [];
  tupa!: Tupa;
  requisitos: Requisito[] = [];
  reqSel: Requisito[] = [];
  costos: Costo[] = [];
  tributosDetalle: TributoDetalle[] = [];  //MAIN
  // cliente!: Cliente;
  nombre_completo: string = '';
  subTotal: number = 0;

  correlativo: number = 0;
  spinner: boolean = false;

  itemsTicket: ItemTicket[] = [];

  @Input() cliente!: Cliente;
  @Input() caja!: Caja;

  constructor(
    private tributoService: TributoService ,
    private tupaService: TupaService,
    private requisitoService: RequisitoService,
    private usuarioService: UsuarioService,
    private pagosserviciosService: PagosServiciosService,
    private costoService: CostoService) { }

  ngOnInit(): void {
    // this.idCliente = this.activatedRoute.snapshot.params["idCliente"];
    this.listarTupas();
    this.cargarCliente();
    // this.getCorrelativo();
  }

  cargarCliente(){
    this.nombre_completo = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;

    this.setCostoCliente();
  }


  listarTupas(){
    this.tupaService.getAllTupas()
    .subscribe({
      next: ( resp:Tupa[] )=> {
        this.tupas = resp;
      },
      error: error => console.log(error)
    });
  }

  seleccionTupa(tupa: HTMLSelectElement){

    this.tupaService.getTupaById(Number(tupa.value))
    .subscribe({
      next: ( resp:Tupa )=> {
        this.tupa = resp;
      },
      error: error => console.log(error)
    });

    this.spinner = true;

    if (tupa.value !== '0') {
      this.requisitoService.getReqsByTupa(tupa.value)
      .subscribe({
        next: ( resp:any )=> {
          this.requisitos = resp.requisitos;
        },
        error: error => console.log(error),
        complete: ()=> this.spinner = false
      });
    }else{
      this.requisitos = [];
      return;
    }
  }

  addRequisito(req: any){
    this.reqSel.push(req);
    this.operaciones();
    //TODO: crear el array de detalles
  }

  quitarRequisito(index: number){
    this.reqSel.splice(index, 1);
    this.operaciones();
  }

  // handleMonto(){
  //   console.log(this.reqSel);
  // }

  operaciones(){
    this.subTotal = 0;
    this.reqSel.map( (item)=>{
      this.subTotal += Number(item.monto_ref);
    });
  }

  // REGISTRAR TRIBUTO
  registrarTributo(){

    if (this.reqSel.length <= 0) {
      alert('No hay tributos seleccionados');
      return;
    }

    if (!confirm('¿Registrar pago de tributo?')) {
      return;
    }

    let tributo: Tributo = {
      usuario: this.usuarioService.getLocalUser().username,
      dettupa: this.tupa.denominacion,
      detrequisito: this.tupa.denominacion,
      subtotal: this.subTotal,
      cliente: this.cliente,
      user: this.usuarioService.getLocalUser(),
      correlativo: null
    }

    this.tributoService.saveTributo(tributo)
    .subscribe({
      next: (resp:Tributo)=>{
        this.registrarDetalleTributo(resp);
        this.registrarPagosAndDetalles(resp);
      },
      error: error => console.log(error),
      complete: ()=> {
        this.reqSel = [];
      }
    });
  }

  registrarDetalleTributo( tributo: Tributo ){

    this.reqSel.map( (item: Requisito)=>{

      let tributoDetalle : TributoDetalle= {
        datosclientes: `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`,
        direccion: this.cliente.zona.detazona,
        monto: item.monto_ref,
        usuaCrea: this.usuarioService.getLocalUser().username,
        fecha: moment().toDate(),
        esta: 1,
        correlativo: tributo.correlativo || 0,
        idanno: moment().year(),
        cliente: this.cliente,
        requisito: item,
        tributo: tributo
      }

      this.tributosDetalle.push(tributoDetalle);

    });

    this.tributoService.saveDetalleTributo(this.tributosDetalle)
    .subscribe({
      next: (resp)=> console.log(resp),
      error: error => console.log(error),
      complete: () => {

      }
    });

  }

  setCostoCliente(){
    this.costoService.getCostsByClient(Number(this.cliente.idclientes))
    .subscribe({
      next: (resp)=> {
        this.costos = resp;
      },
      error: error => console.log(error)
    });
  }

  registrarPagosAndDetalles(tributo: Tributo){

    // seteando tipo de pago
    let tipoPago: TipoPagoServicio = {
      descripcion: null,
      idtipopagosservicio: 2
    }

    // seteando estado de pago
    let pagoServicioEstadoS: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1
    }

    let pagoServicio: PagosServicio = {
      costo: this.costos[0],
      montoapagar: tributo.subtotal,
      montotasas: 0.0,
      montodescuento: 0.0,
      montopagado: tributo.subtotal,
      fecha: moment().toDate(),
      usuario: this.usuarioService.getLocalUser(),
      esta: 1,
      correlativo: null,
      caja: this.caja,
      cliente: tributo.cliente,
      tipoPagoServicios: tipoPago,
      pagoServicioEstado: pagoServicioEstadoS
    }

    let detallesPago: PagosServicioDetalle[] = this.setearDetalles(pagoServicio);

    this.pagosserviciosService.savePagosAndDetalles(pagoServicio, detallesPago)
    .subscribe({
      next: (resp: any)=> {

        resp.detalles.map((detalle:any)=>{

          let arrItem:ItemTicket = {
            concepto: detalle.detalletasas,
            mes: '--',
            monto:detalle.monto
          }

          this.itemsTicket.push(arrItem);

        });

        // CREANDO EL TICKET [✔]
        const ticket: Ticket = new Ticket(
          Number(resp.pagosservicio.correlativo),
          Number(resp.pagosservicio.cliente.idclientes),
          `${resp.pagosservicio.cliente.apepaterno} ${resp.pagosservicio.cliente.apematerno} ${resp.pagosservicio.cliente.nombres}`,
          resp.pagosservicio.cliente.direccion,
          resp.pagosservicio.montopagado,
          this.itemsTicket);

        ticket.pagar();
      },
      error: error => console.log(error),
      complete: () => {
        this.subTotal = 0.00;
        this.reqSel = [];
      }
    });
  }

  setearDetalles(pagoServicio: PagosServicio): PagosServicioDetalle[] {
    let pagosServicioDeta: PagosServicioDetalle;
    let pagServDetalles: PagosServicioDetalle[] = [];

    this.reqSel.map((itemPago:Requisito) => {
      pagosServicioDeta = {
        idcabecera: 1,
        idmes: 1,
        detalletasas: itemPago.requisitos,
        idanno: moment().year(),
        monto: itemPago.monto_ref,
        cliente: this.cliente,
        pagosServicio: pagoServicio,
      };
      pagServDetalles.push(pagosServicioDeta);
    });

    return pagServDetalles;
  }
}
