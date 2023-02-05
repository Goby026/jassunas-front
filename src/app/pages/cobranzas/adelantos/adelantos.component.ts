import { Component, Input, OnInit } from '@angular/core';
import { CostoOtrosService } from '../../../services/costo-otros.service';
import * as moment from 'moment';
import { Tarifario } from 'src/app/models/tarifario.model';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Costo } from 'src/app/models/costo.model';
import { Caja } from 'src/app/models/caja.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { Ticket } from '../Ticket';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-adelantos',
  templateUrl: './adelantos.component.html',
  styleUrls: ['./adelantos.component.css']
})
export class AdelantosComponent implements OnInit {

  @Input() costos!: Costo[];
  @Input() cliente!: Cliente;
  @Input() caja!: Caja;

  datos: any[] = [];
  anios: number[] = [];
  anio = moment().year()-1;
  anioSel: any = 0;
  anioHtml: any;
  // idCosto: number = 0;
  tarifa!: Tarifario;
  costoOtroServicio!: CostoOtroServicio;
  meses: ItemTicket[] = [];
  monto: number = 0;
  arregloPagar: ItemTicket[] = [];
  pagosDetalles: PagosServicioDetalle[]= [];
  spinner: boolean = true;


  usuario!: Usuario;

  constructor(
    private costoOtroService: CostoOtrosService,
    private pagosservicio: PagosServiciosService,
    private usuarioService: UsuarioService
    ){}

  ngOnInit(): void {

    this.obtenerTarifaCliente(Number(this.costos[0].codcosto));
    this.setearArregloAnios();
    // setTimeout(() => {
    //   this.setearMeses();
    //   this.spinner = false;
    // }, 1000);
  }

  setearArregloAnios(){
    for(let i = this.anio; i < this.anio+5; i++){
      this.anios.push(i);
    }
  }

  setearMeses(anio: HTMLSelectElement){
    this.anioHtml = anio;
    this.anioSel = anio.value;
    let totalMeses: ItemTicket[] = [
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Enero',
        nmes: 1,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Febrero',
        nmes: 2,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Marzo',
        nmes: 3,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Abril',
        nmes: 4,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Mayo',
        nmes: 5,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Junio',
        nmes: 6,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Julio',
        nmes: 7,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Agosto',
        nmes: 8,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Setiembre',
        nmes: 9,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Octubre',
        nmes: 10,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Noviembre',
        nmes: 11,
        monto: this.tarifa.monto
      },
      {
        concepto: 'MANTENIMIENTO',
        fecha: moment().toDate(),
        mes: 'Diciembre',
        nmes: 12,
        monto: this.tarifa.monto
      },

    ]

    this.mostrarMesesPagar(Number(anio.value), totalMeses);

  }

  // 1: obtener las tarifas de la tabla tbcostootroservicio
  obtenerTarifaCliente(costoCliente: number){
    this.costoOtroService.getCosto_otros(costoCliente)
    .subscribe({
      next:( resp: CostoOtroServicio[] )=>{
        this.tarifa = resp[0].tarifario;
      },
      error: error => console.error(error),
      complete: ()=>{
        let username = localStorage.getItem('username') || '';
        this.usuario = this.usuarioService.getLocalUser();
      }
    });
  }

  agregarMes(checkMes: HTMLInputElement, month: ItemTicket){

    this.arregloPagar = this.arregloPagar.filter( (item)=>{
      return item !== month;
    });

    if (checkMes.checked) {

      this.arregloPagar.push(month);

    }

    this.operarMonto();
  }

  /*
  * 1° se debe registrar en las tablas tbpagosservicios - tbpagosserviciosdeta
  *luego se puede registrar a en la tabla adelantos
  */
  registrarAdelanto(){

    if (this.arregloPagar.length <= 0) {
      alert('Nada para cobrar');
      return;
    }

    if (this.anioSel <= 0) {
      alert('Debe seleccionar un año');
      return;
    }

    if (!confirm('¿Registrar adelanto(s)?')) {
      return;
    }

    // seteando tipo de pago
    let tipoPagoS: TipoPagoServicio = {
      descripcion: null,
      idtipopagosservicio: 3
    }

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1
    }

    let pagosServicioR: PagosServicio = {
      costo: this.costos[0],
      cliente: this.cliente,
      montoapagar: this.monto,
      montotasas: 0,
      montodescuento: 0,
      montopagado: this.monto,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: null,
      caja: this.caja,
      tipoPagoServicios: tipoPagoS,
      pagoServicioEstado: tipoPagoServiciosE
    }

    let arrPagosServiciosDetallesR: PagosServicioDetalle[] = this.registrarPagoServiciosDetalles(pagosServicioR);

    this.pagosservicio.savePagosAndDetalles(pagosServicioR, arrPagosServiciosDetallesR)
    .subscribe({
      next: (resp: any) => {
          // CREANDO EL TICKET [✔]
          const ticket: Ticket = new Ticket(
            Number(resp.pagosservicio.correlativo),
            Number(resp.pagosservicio.cliente.idclientes),
            `${resp.pagosservicio.cliente.apepaterno} ${resp.pagosservicio.cliente.apematerno} ${resp.pagosservicio.cliente.nombres}`,
            resp.pagosservicio.cliente.direccion,
            this.monto,
            this.arregloPagar);

          ticket.pagar();
      },
      error: error => console.log(error),
      complete: ()=>{
        this.setearMeses(this.anioHtml);
        this.arregloPagar = [];
        this.monto = 0.00;
      }
    });
  }


  verArregloPagos(){
    console.log(this.arregloPagar);
  }

  registrarPagoServiciosDetalles(pagoServicio: PagosServicio):PagosServicioDetalle[] {
    let arrPagosServiciosDetalles: PagosServicioDetalle[] = [];
    this.arregloPagar.map( (item)=>{
      let pagosServiciosDeta: PagosServicioDetalle = {
        idcabecera : 1,
        idmes :  item.nmes,
        detalletasas : 'ADELANTO',
        idanno : Number(this.anioSel),
        monto : item.monto,
        cliente : this.cliente,
        pagosServicio : pagoServicio,
      };
      arrPagosServiciosDetalles.push(pagosServiciosDeta);
    } );
    return arrPagosServiciosDetalles;
  }


  mostrarMesesPagar(anio: number, totalMeses: ItemTicket[]){
    //cargar pagos de cliente

    this.pagosservicio.getDetallePagosClienteAnio(Number(this.cliente.idclientes), anio)
    .subscribe({
      next: (resp:PagosServicioDetalle[])=>{
        this.pagosDetalles = resp;
      },
      error: err=>console.log(err),
      complete: ()=>{
        let mesesPagados:ItemTicket[] =[];
        let mesPagado:ItemTicket;

        this.pagosDetalles.forEach( (detalle:PagosServicioDetalle)=>{
          mesPagado = {
            concepto: detalle.detalletasas,
            monto: detalle.monto,
            nmes: detalle.idmes
          }

          mesesPagados.push(mesPagado);
        });

        let mesesSinPagar: ItemTicket[] = totalMeses.filter( item1 => !mesesPagados.some( item2 => item2.nmes === item1.nmes ) );

        this.spinner = false;
        this.meses = mesesSinPagar;
      }
    });
  }

  operarMonto(){
    this.monto = 0;
    this.arregloPagar.forEach( (item)=>{
      this.monto += item.monto!
    });
  }

}
