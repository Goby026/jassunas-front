import { Component, Input, OnInit } from '@angular/core';
import { CostoService } from '../../../services/costo.service';
import { CostoOtrosService } from '../../../services/costo-otros.service';
import * as moment from 'moment';
import { Tarifario } from 'src/app/models/tarifario.model';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Costo } from 'src/app/models/costo.model';
import { CajaService } from 'src/app/services/caja.service';
import { Caja } from 'src/app/models/caja.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { ClienteService } from 'src/app/services/cliente.service';
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

  @Input() idCliente = 0;

  datos: any[] = []
  anios: number[] = [];
  anio = moment().year();
  anioSel: any = 0;
  idCosto: number = 0;
  tarifa!: Tarifario;
  costoOtroServicio!: CostoOtroServicio;
  meses: ItemTicket[] = [];
  monto: number = 0;
  arregloPagar: ItemTicket[] = [];
  spinner: boolean = true;
  costo!: Costo;
  caja!: Caja;
  cliente!: Cliente;
  usuario!: Usuario;

  constructor(
    private costoService: CostoService,
    private clienteService: ClienteService,
    private costoOtroService: CostoOtrosService,
    private pagosservicio: PagosServiciosService,
    private usuarioService: UsuarioService,
    private cajaService: CajaService, ) { }

  ngOnInit(): void {
    console.log('Adelanto de cliente: ', this.idCliente);
    this.obtenerCostoCliente(this.idCliente);
    this.setearArregloAnios();
    this.verificarCaja();
    setTimeout(() => {
      this.setearMeses();
      this.spinner = false;
    }, 1000);
  }

  verificarCaja(){
    this.cajaService.getCajaStatus()
    .subscribe({
      next: (resp: Caja)=>{
        if(resp.esta!==1){
          alert('Caja no esta aperturada');
        }else{
          this.caja = resp;
        }
      },
      error: error=> console.log(error),
      complete: ()=> {
        let username = localStorage.getItem('username') || '';
        this.usuario = this.usuarioService.getLocalUser();
      }
    });
  }

  setearArregloAnios(){
    for(let i = this.anio; i < this.anio+5; i++){
      this.anios.push(i);
    }
  }

  setearMeses(){
    this.meses = [
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
  }

  obtenerCostoCliente(codcliente: number){
    // 1: obtener el costo del cliente
    this.costoService.getCostsByClient(codcliente)
    .subscribe({
      next:( resp: Costo[] )=>{
        this.idCosto = Number(resp[0].codcosto);
      },
      error: error => console.log(error),
      complete: ()=>{
        this.obtenerTarifaCliente(this.idCosto);
      }
    });
  }

  // 2: obtener las tarifas de la tabla tbcostootroservicio
  obtenerTarifaCliente(costoCliente: number){
    this.costoOtroService.getCosto_otros(costoCliente)
    .subscribe({
      next:( resp: CostoOtroServicio[] )=>{
        this.tarifa = resp[0].tarifario;
        console.log('Tarifas------->', this.tarifa);
      },
      error: error => console.log(error),
      complete: ()=>{
        // setear costo
        this.costoService.getCostoById(this.idCosto)
        .subscribe({
          next: (resp: Costo)=>{
            console.log('costo',resp);
            this.costo = resp;
          },
          error: error => console.log(error)
        });

        //setear cliente
        this.clienteService.getClientById(this.idCliente)
        .subscribe({
          next: (resp: Cliente)=>{
            console.log('cliente', resp)
            this.cliente = resp;
          },
          error: error => console.log(error)
        });
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
      costo: this.costo,
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

    this.pagosservicio.savePagoServicio(pagosServicioR)
    .subscribe({
      next:( resp: PagosServicio )=>{
        this.registrarPagoServiciosDetalles(resp);

        // CREANDO EL TICKET [✔]
        const ticket: Ticket = new Ticket(resp.correlativo, this.idCliente,`${resp.cliente.apepaterno} ${resp.cliente.apematerno} ${resp.cliente.nombres}`, resp.cliente.direccion, this.monto, this.arregloPagar);

        ticket.pagar();
      },
      error: error => console.log(error),
      complete: ()=>{
        this.anio = 0;
        this.arregloPagar = [];
      }
    });

  }

  registrarPagoServiciosDetalles(pagoServicio: PagosServicio){
    let arrPagosServiciosDetalles: PagosServicioDetalle[] = [];

    this.arregloPagar.map( (item)=>{

      let pagosServiciosDeta: PagosServicioDetalle = {
        idcabecera : 1,
        idmes :  moment(item.fecha).month(),
        detalletasas : 'ADELANTO',
        idanno : Number(this.anioSel),
        monto : item.monto,
        cliente : this.cliente,
        pagosServicio : pagoServicio,
      };

      arrPagosServiciosDetalles.push(pagosServiciosDeta);

    } );

    this.pagosservicio.savePagosServicioDetalle(arrPagosServiciosDetalles)
    .subscribe({
      next:( resp: any )=>{
        console.log(resp)
      },
      error: error => console.log(error)
    });
  }

  operarMonto(){
    this.monto = 0;
    this.arregloPagar.forEach( (item)=>{
      this.monto += item.monto
    } );
  }

}
