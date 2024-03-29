import { Component, OnInit } from '@angular/core';
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
import { CostoService } from 'src/app/services/costo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { CajaService } from 'src/app/services/caja.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { Deuda } from 'src/app/models/deuda.model';

@Component({
  selector: 'app-adelantos',
  templateUrl: './adelantos.component.html'
})
export class AdelantosComponent implements OnInit {

  caja!: Caja;
  cliente!: Cliente;
  costos!: Costo[];
  deudas: Deuda[] = [];

  datos: any[] = [];
  anios: number[] = [];
  anio = moment().year()-6;
  anioSel: any = 0;
  anioHtml: any;
  tarifa!: Tarifario;
  costoOtroServicio!: CostoOtroServicio;
  meses: ItemTicket[] = [];
  monto: number = 0;
  subtotal: number = 0;
  dcto: number = 0;
  observacionDcto: string = '';
  arregloPagar: ItemTicket[] = [];
  pagosDetalles: PagosServicioDetalle[]= [];
  spinner: boolean = true;
  tieneDeuda: boolean = false;
  msg: string = '¡El socio seleccionado presenta multa(s) pendiente(s), no se puede registrar pago(s)!';

  isDisabled = false;
  usuario!: Usuario;

  constructor(
    private cajaService: CajaService,
    private costoOtroService: CostoOtrosService,
    private pagosservicio: PagosServiciosService,
    private usuarioService: UsuarioService,
    private costoService: CostoService,
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){}

  ngOnInit(): void {
    const {idCliente} = this.activatedRoute.snapshot.params;
    this.verificarEstadoCaja();
    this.setearArregloAnios();
    this.cargarCliente(idCliente);
    this.cargarCostosCliente(idCliente);
    //this.obtenerTarifaCliente(Number(this.costos[0].codcosto));

    // setTimeout(() => {
    //   this.setearMeses();
    //   this.spinner = false;
    // }, 1000);
  }

  verificarEstadoCaja() {
    this.cajaService.getCajaStatus().subscribe({
      next: (resp: Caja) => {
        if (resp) {
          if (resp.esta !== 1) {
            alert('Caja no esta aperturada');
            this.router.navigate(['/dashboard/caja']);
          } else {
            this.caja = resp;
          }
        }else{
          alert('No hay resultado de cobranzas');
        }
      },
      error: (error) => console.log(error)
    });
  }

  cargarCostosCliente(idCli: number){
    this.costoService.getCostsByClient(idCli)
    .subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
      complete: ()=> this.obtenerTarifaCliente(Number(this.costos[0].codcosto))
    });
  }

  cargarCliente(id: number){
    this.clienteService.getClientById(id)
    .subscribe({
      next: (resp: Cliente)=> this.cliente = resp,
      error: error=> console.log(error),
      complete: ()=> this.cargarDeudasCliente(id)
    });
  }

  cargarDeudasCliente(idCliente: number) {
    let totalDeudas: Deuda[] = [];
    this.deudaService.getUserDebt(idCliente)
    .subscribe({
      next: (resp: Deuda[]) => {
        totalDeudas = resp;
        this.deudas = resp.filter( (deuda)=> {
          return ( deuda.deudaDescripcion.iddeudadescripcion == 1
            || deuda.deudaDescripcion.iddeudadescripcion == 2 || deuda.deudaDescripcion.iddeudadescripcion == 3);
        });
      },
      error: (error) => console.log(error),
      complete: ()=> {
        this.tieneDeuda = this.deudaService.verifyPenalty(totalDeudas);
      }
    });
  }

  setearArregloAnios(){
    for(let i = this.anio; i < this.anio+8; i++){
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
      month.nannio = Number(this.anioSel);
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

    this.isDisabled = true;

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
      montoapagar: this.subtotal,
      montotasas: 0,
      montodescuento: this.dcto,
      montopagado: this.monto,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: null,
      observacion: this.observacionDcto,
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

          ticket.pagar(this.observacionDcto, this.dcto, this.subtotal);
      },
      error: error => console.log(error),
      complete: ()=>{
        this.setearMeses(this.anioHtml);
        this.arregloPagar = [];
        this.monto = 0.00;
        this.subtotal = 0.00;
        this.isDisabled = false;
        this.cleanData();
      }
    });
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
          // console.log( 'tipo pago servicio', detalle.pagosServicio.tipoPagoServicios.idtipopagosservicio);

          if (detalle.pagosServicio.tipoPagoServicios.idtipopagosservicio !== 2 && detalle.pagosServicio.tipoPagoServicios.idtipopagosservicio !== 4) {
            mesPagado = {
              concepto: detalle.detalletasas,
              monto: detalle.monto,
              nmes: detalle.idmes,
              estado: detalle.pagosServicio.pagoServicioEstado.idpagoestado
            }

            mesesPagados.push(mesPagado);
          }
        });

        let mesesSinPagar: ItemTicket[] = totalMeses.filter( item1 => {
          return !mesesPagados.some( item2 => {
            return item2.nmes === item1.nmes && item2.estado !== 4
          })});

        this.spinner = false;
        this.meses = mesesSinPagar;
      }
    });
  }

  cleanData(){
    // this.deudas = [];
    this.dcto = 0;
    this.observacionDcto = '';
    this.operarMonto();
  }

  aplicarDcto(e: any){
    this.dcto = Number(e.descuento);
    if (this.dcto <= 0) {
      return;
    }
    this.observacionDcto = String(e.mensaje);
    this.operarMonto();
  }

  operarMonto(){
    this.monto = 0;
    this.subtotal = 0;
    this.arregloPagar.forEach( (item)=>{
      this.monto += item.monto!
      this.subtotal += item.monto!
    });

    if(this.dcto != 0){
      this.monto -= this.dcto
    }
  }

}
