import { Component, OnInit } from '@angular/core';

import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HistorialReport } from '../../reports/HistorialReport';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Ticket } from '../Ticket';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { DateService } from 'src/app/services/date.service';
import { TicketTributo } from '../TicketTributo';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaService } from 'src/app/services/deuda.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
})
export class HistorialComponent implements OnInit {
  // @Input() idCliente: number = 0;
  cliente!: Cliente;
  pagos: PagosServicio[] = [];
  pagosDetalle: PagosServicioDetalle[] = [];
  deudas!: Deuda[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private pagosService: PagosServiciosService,
    private clienteService: ClienteService,
    private deudasService: DeudaService,
    public dateService: DateService
  ) {}

  ngOnInit(): void {
    // this.idCliente = this.activatedRoute.snapshot.params["idCliente"];
    const {idCliente} = this.activatedRoute.snapshot.params;
    this.cargarCliente(Number(idCliente));
    this.cargarPagos(Number(idCliente));
    this.cargarDeudasCondonadas(idCliente);
  }

  cargarCliente(id: number){
    this.clienteService.getClientById(id)
    .subscribe({
      next: (resp: Cliente)=> this.cliente = resp,
      error: error=> console.log(error)
    });
  }

  crearPdf() {
    const nombreCompleto: string = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;
    const reporte: HistorialReport = new HistorialReport(
      nombreCompleto,
      this.pagosDetalle
    );

    reporte.reporte();
  }

  // cargar pagos de un determinado cliente
  cargarPagos(id: number) {
    this.pagosService
      .getPagosByCliente(id)
      .subscribe({
        next: (resp: PagosServicio[]) => {
          this.pagos = resp;
        },
        error: (error) => console.log(error),
      });
  }

  cargarDeudasCondonadas(idCliente : number){
    this.deudasService.getUserDebt( idCliente, 5 )
    .subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp;
      },
      error: (error) => console.log(error),
    });
  }

  // el historial es la lista de detalles de un pago determinado
  mostrarConcepto(pago: PagosServicio, opc: boolean = false) {
    this.pagosService.getDetallePago(Number(pago.id)).subscribe({
      next: (resp: PagosServicioDetalle[]) => {
        resp.map((item) => {
          item.idmes;
        });

        this.pagosDetalle = resp;
      },
      error: (error) => console.log(error),
      complete: () => {
        if (opc) {
          this.setVoucher(pago);
        }
      },
    });
  }

  setVoucher(pago: PagosServicio) {
    if (pago.tipoPagoServicios.idtipopagosservicio != 2) {
      //seteando ticket
      let itemsTicket: ItemTicket[] = this.setTicket();

      // CREANDO EL TICKET [✔]
      const ticket: Ticket = new Ticket(
        Number(pago.correlativo),
        Number(pago.cliente.idclientes),
        `${pago.cliente.apepaterno} ${pago.cliente.apematerno} ${pago.cliente.nombres}`,
        pago.cliente.direccion,
        pago.montopagado,
        itemsTicket,
        String(pago.fecha)
      );
      ticket.pagar(pago.observacion!, pago.montodescuento, pago.montoapagar);
    } else {
      // VOUCHER DE TRIBUTO
      const ticketTributo: TicketTributo = new TicketTributo(
        `${pago.cliente.apepaterno} ${pago.cliente.apematerno} ${pago.cliente.nombres}`,
        pago.cliente.direccion,
        pago.montopagado,
        pago,
        this.pagosDetalle
      );

      ticketTributo.pagar();
    }
  }

  setTicket(): ItemTicket[] {
    let items: ItemTicket[] = [];
    let item: ItemTicket;

    this.pagosDetalle.forEach((pago: PagosServicioDetalle) => {
      item = {
        concepto: pago.detalletasas,
        monto: pago.monto,
        mes: pago.idmes,
        nannio: pago.idanno,
      };
      items.push(item);
    });
    return items;
  }
}
