import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaService } from 'src/app/services/deuda.service';

import { DateService } from 'src/app/services/date.service';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { CostoService } from 'src/app/services/costo.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Costo } from 'src/app/models/costo.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Caja } from 'src/app/models/caja.model';
import { Cliente } from 'src/app/models/cliente.model';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
import { TicketPago } from '../TicketPago';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CajaService } from 'src/app/services/caja.service';
import { Condonacion } from 'src/app/models/condonacion.model';
import { CondonacionService } from 'src/app/services/condonacion.service';

@Component({
  selector: 'app-pagos-deudas-condonaciones',
  templateUrl: './pagos-deudas-condonaciones.component.html',
})
export class PagosDeudasCondonacionesComponent implements OnInit {

  isDisabled = false;
  correlativo: number = 0;

  monto: number = 0;
  subtotal: number = 0;
  dcto: number = 0;
  usuario!: Usuario;
  caja!: Caja;
  cliente!: Cliente;

  costos!: Costo[];
  deudas: Deuda[] = [];
  deudasToUpdate: Deuda[] = [];
  tieneDeuda: boolean = false;
  pagos: ItemTicket[] = [];

  condonacion!: Condonacion;
  observacion!: string;
  observacionDcto!: string;
  msg: string = '¡El socio seleccionado presenta multa(s) pendiente(s), no se puede registrar pago(s)!';

  constructor(
    private cajaService: CajaService,
    private deudaService: DeudaService,
    private costoService: CostoService,
    public dateService: DateService,
    private pagosService: PagosServiciosService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private condonacionService: CondonacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    const {idCliente} = this.activatedRoute.snapshot.params;
    this.verificarEstadoCaja();
    // this.crearFormularioCondonacion();
    this.cargarCliente(idCliente);
    this.cargarDeudasCliente(idCliente);
    this.cargarCostosCliente(idCliente);
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
      error: (error) => console.log(error),
      complete: () => {
        this.usuario = this.usuarioService.getLocalUser();
      },
    });
  }

  cargarCliente(id: number){
    this.clienteService.getClientById(id)
    .subscribe({
      next: (resp: Cliente)=> this.cliente = resp,
      error: error=> console.log(error),
      // complete: ()=> console.log(this.cliente)
    });
  }

// ************OBTENER COSTO DE CLIENTE************
  cargarCostosCliente(idCli: number){
    this.costoService.getCostsByClient(idCli)
    .subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
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

// ************metodo para registrar entidad PagosServicio************
  regPagosServicio():void {
    if (this.pagos.length <= 0 || this.monto === 0) {
      alert('Nada para cobrar');
      return;
    }

    if (!window.confirm('¿Realizar operación?')) {
      return;
    }

    this.isDisabled = true;

    // seteando tipo de pago
    let tipoPago: TipoPagoServicio = {
      descripcion: '',
      idtipopagosservicio: 1
    }

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1
    }

    let pagoServicio: PagosServicio = {
      costo: this.costos[0],
      montoapagar: this.subtotal,
      montotasas: 0.0,
      montodescuento: this.dcto,
      montopagado: this.monto,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: 1,
      observacion: this.observacionDcto,
      caja: this.caja,
      cliente: this.cliente,
      tipoPagoServicios: tipoPago,
      pagoServicioEstado: tipoPagoServiciosE
    };

    // seteando estado de deudas (2)
    this.deudasToUpdate.map((item) => {
       return {
        idtbdeudas: item.idtbdeudas,
        cliente: item.cliente,
        codigo: item.codigo,
        deudaDescripcion: item.deudaDescripcion,
        deudaEstado: item.deudaEstado.iddeudaEstado = 2,
        periodo: item.periodo,
        total: item.total,
        saldo: item.saldo,
        vencimiento: item.vencimiento,
        estado: item.estado,
        dcto: this.dcto
      }
    });

    let pagServDetalles: PagosServicioDetalle[] = this.regPagosDetalle(pagoServicio);

    // registrando pagoServicio (tabla fuerte)
    this.pagosService.savePagosAndDetalles(pagoServicio, pagServDetalles)
    .subscribe({
      next: (resp: any) => {
        // registrando detalles de pago de deuda
        this.correlativo = Number(resp.pagosservicio.correlativo);
        this.actualizarEstadoDeuda(this.deudasToUpdate);
        this.cargarDeudasCliente(Number(this.cliente.idclientes));
        const ticketPago = new TicketPago(
          this.correlativo,
          this.cliente,
          this.pagos,
          this.dcto,
          this.observacionDcto
        );
        ticketPago.pagar(this.subtotal, this.monto);
      },
      error: (error) => console.log(error),
      complete: () => {
        this.pagos=[];
        this.deudasToUpdate=[];
        this.monto = 0.0;
        this.subtotal = 0.0;
        this.isDisabled = false;
        this.cleanData();
      },
    });
  }

// ************metodo para setear los detalles del pago (tabla dependiente)************
  regPagosDetalle(pagoServicio: PagosServicio):PagosServicioDetalle[]  {
    let pagosServicioDeta: PagosServicioDetalle;
    let pagServDetalles: PagosServicioDetalle[] = [];

    this.pagos.map((itemPago) => {
      pagosServicioDeta = {
        idcabecera: 1,
        idmes: itemPago.nmes,
        detalletasas: itemPago.concepto,
        idanno: Number(itemPago.nannio) | 0,
        monto: itemPago.monto,
        cliente: this.cliente,
        pagosServicio: pagoServicio,
        iddeuda: itemPago.id
      };
      pagServDetalles.push(pagosServicioDeta);
    });
    return pagServDetalles;
  }

  actualizarEstadoDeuda(deudas: Deuda[]) {
    this.deudaService.updateUserDebts(deudas).subscribe({
      next: (resp: any) => {
        // console.log(resp);
      },
      error: (error) => console.log(error),
      complete: () => {
        this.cargarDeudasCliente(Number(this.cliente.idclientes));
      }
    });
  }

  condonarDeuda() {
    if (this.pagos.length <= 0 || this.monto === 0) {
      alert('Nada por condonar');
      return;
    }
  }


  setPago(deudaSel: HTMLInputElement, deuda: Deuda) {

    let itemDeuda: ItemTicket = {
      concepto: 'MANTENIMIENTO',
      // fecha: moment(deuda.periodo).format('MM-YYYY'),
      fecha: this.dateService.getMes( Number(moment(deuda.periodo).month() + 1) ) + " - "+ moment(deuda.periodo).year(),
      nmes: moment(deuda.periodo).month(),
      nannio: moment(deuda.periodo).year(),
      monto: deuda.total,
      id: deuda.idtbdeudas
    }

    if (deudaSel.checked) {
      this.pagos.push(itemDeuda);
      this.deudasToUpdate.push(deuda);
    } else {
      this.pagos = this.pagos.filter((item) => {
        return item.id !== itemDeuda.id;
      });

      this.deudasToUpdate = this.deudasToUpdate.filter( (item)=>{
        return item.idtbdeudas !== deuda.idtbdeudas;
      });
    }
    this.operaciones();
  }

  operaciones() {
    this.monto = 0;
    this.subtotal = 0;
    this.pagos.map((item) => {
      this.monto += Number(item.monto);
      this.subtotal += Number(item.monto);
    });
    if(this.dcto != 0){
      this.monto -= this.dcto
    }
  }


  /* ---------CONDONACIONES--------- */

  registrarCondonacion(){

    let condonacion!: Condonacion;
    let listaCondonaciones:Condonacion[] = []; //array para enviar al back

    let deudas2: Deuda[] = this.deudasToUpdate.map( (item)=> {
      condonacion = {
        estado: 1,
        fecha: new Date(),
        monto: item.total,
        observacion: this.observacion,
        usuario: this.usuario.username,
        deuda: item
      }
      listaCondonaciones.push(condonacion);

      item.total = 0;
      item.deudaEstado.iddeudaEstado = 5;
      item.observacion = this.observacion;

      return item;
    });

    // console.log(deudas2);

    this.condonacionService.saveCondonaciones(listaCondonaciones)
    .subscribe({
      next: ( resp:any )=>{
        console.log('Registro: ' + resp);
      },
      error: error => console.log(error),
      complete: ()=> {
        this.actualizarEstadoDeudaCondonada(deudas2);
        this.pagos=[];
        this.deudasToUpdate=[];
        this.monto = 0.0;
        this.isDisabled = false;
      }
    });

    // EMITIR ORDEN PARA ACTUALIZAR LISTA DE DEUDAS
  }

  // actualizar estado de deuda (iddeuda_estado) a 1
  actualizarEstadoDeudaCondonada(deudas: Deuda[]){
    this.deudaService.updateUserDebts(deudas)
    .subscribe({
      next: ( resp:any )=>{
        console.log(resp);
      },
      error: error => console.log(error),
      complete: ()=> {
        this.cargarDeudasCliente(Number(this.cliente.idclientes));
        this.cleanData()
      }
    });
  }

  cleanData(){
    // this.deudas = [];
    this.dcto = 0;
    this.observacionDcto = '';
    this.operaciones()
  }

  aplicarDcto(e: any){
    this.dcto = Number(e.descuento);
    if (this.dcto <= 0) {
      return;
    }
    this.observacionDcto = String(e.mensaje);
    this.operaciones();
  }

}
