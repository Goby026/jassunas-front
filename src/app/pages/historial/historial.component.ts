import { Component, Input, OnInit } from '@angular/core';

import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HistorialReport } from '../reports/HistorialReport';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Ticket } from '../cobranzas/Ticket';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { DateService } from 'src/app/services/date.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  // @Input() idCliente: number = 0;
  @Input() cliente!: Cliente;
  pagos: PagosServicio[] = [];
  pagosDetalle: PagosServicioDetalle[] = [];

  constructor(
    // private activatedRoute: ActivatedRoute,
    private pagosService: PagosServiciosService,
    public dateService: DateService
    ) { }

  ngOnInit(): void {
    // this.idCliente = this.activatedRoute.snapshot.params["idCliente"];
    this.cargarPagos();
    // this.cargarHistorial();
  }


  crearPdf(){
    const nombreCompleto: string = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;
    const reporte: HistorialReport = new HistorialReport(nombreCompleto,this.pagosDetalle);

      reporte.reporte();
  }

  // cargar pagos de un determinado cliente
  cargarPagos(){
    this.pagosService.getPagosByCliente(Number(this.cliente.idclientes))
    .subscribe({
      next: (resp:PagosServicio[])=>{
        console.log('cargando pagos------->', resp);
        this.pagos = resp;
      },
      error: (error)=> console.log(error)
    });
  }


  // el historial es la lista de detalles de un pago determinado
  printVoucher(pago: PagosServicio, opc: boolean = false){
    this.pagosService.getDetallePago(Number(pago.id))
    .subscribe({
      next: (resp:PagosServicioDetalle[])=>{

        resp.map( (item)=>{
          item.idmes
        });

        this.pagosDetalle = resp;
      },
      error: (error)=> console.log(error),
      complete: () =>{
        if (opc) {
          this.setVoucher(pago);
        }
      }
    });
  }

  setVoucher(pago: PagosServicio) {
    //seteando ticket
    let itemsTicket: ItemTicket[] = this.setTicket();

    // CREANDO EL TICKET [✔]
    const ticket: Ticket = new Ticket(
      Number(pago.correlativo),
      Number(pago.cliente.idclientes),
      `${pago.cliente.apepaterno} ${pago.cliente.apematerno} ${pago.cliente.nombres}`,
      pago.cliente.direccion,
      pago.montopagado,
      itemsTicket);
    ticket.pagar();
  }

  setTicket():ItemTicket[] {
    let items: ItemTicket[] = [];
    let item: ItemTicket;

    this.pagosDetalle.forEach( (pago:PagosServicioDetalle )=>{
      item = {
        concepto: pago.detalletasas,
        monto: pago.monto,
        mes: pago.idmes,
      }
      items.push( item );
    } );
    return items;
  }

}
