import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Caja } from 'src/app/models/caja.model';
import { Cliente } from 'src/app/models/cliente.model';
import { Costo } from 'src/app/models/costo.model';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaDescripcion } from 'src/app/models/deudadescripcion.model';
import { DeudaEstado } from 'src/app/models/deudaestado.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CajaService } from 'src/app/services/caja.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import * as moment from 'moment';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { TicketMulta } from '../TicketMulta';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html'
})
export class MultasComponent implements OnInit {

  caja!: Caja;
  cliente!: Cliente;
  usuario!: Usuario;
  multas!: Deuda[];
  tipoMultas! : DeudaDescripcion[];
  costos! : Costo[];

  multaForm: boolean = false;
  form!: FormGroup;

  constructor(
    private cajaService: CajaService,
    private router: Router,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private deudaService: DeudaService,
    private costoService: CostoService,
    private pagosService: PagosServiciosService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    const {idCliente} = this.activatedRoute.snapshot.params;
    this.verificarEstadoCaja();
    this.cargarCliente(idCliente);
    this.crearFormulario();
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

  crearFormulario(){
    this.form = new FormGroup({
      'tipoMulta': new FormControl(null, Validators.required),
      'monto': new FormControl(0.0, Validators.required),
      'observacion': new FormControl(null),
    });
  }

  cargarCliente(id: number){
    this.clienteService.getClientById(id)
    .subscribe({
      next: (resp: Cliente)=> this.cliente = resp,
      error: error=> console.log(error),
      complete: ()=> {
        this.cargarMultasCliente(Number(this.cliente.idclientes));
        this.cargarCostosCliente(Number(this.cliente.idclientes));
      }
    });
  }

  cargarMultasCliente(id: number){
    this.deudaService.getAllUserDebt(id)
    .subscribe({
      next: (resp: Deuda[]) => {
        this.multas = resp.filter( (multa)=> {
          return ((multa.deudaDescripcion.iddeudadescripcion == 3
          || multa.deudaDescripcion.iddeudadescripcion == 4
          || multa.deudaDescripcion.iddeudadescripcion == 5) && multa.deudaEstado.iddeudaEstado == 3 );
        } );
      },
      error: (error) => console.log(error),
    });
  }

  cargarTiposMulta(){
    this.multaForm = true;
    this.deudaService.getAllDeudaDescripcion()
    .subscribe({
      next: (resp: DeudaDescripcion[])=> {
        this.tipoMultas = resp.filter( (tipo)=> {
          return tipo.estado != 0;
        } );
      },
      error: error=> console.log(error),
      // complete: ()=> console.log(this.tipoMultas)
    });
  }

  pagarDeuda(multa: Deuda){
    if (!confirm('¿Cancelar deuda?')) {
      return;
    }

    let newMulta: Deuda = {...multa};

    let newDeudaEstado: DeudaEstado = {...multa.deudaEstado};
    newDeudaEstado.iddeudaEstado = 2;

    newMulta.estado = 2;
    newMulta.saldo = 0;
    newMulta.deudaEstado = newDeudaEstado;
    newMulta.observacion = 'Sin observaciones';

    this.deudaService.updateUserDebt(newMulta)
    .subscribe({
      next: (resp:Deuda)=> {
        if(resp) alert('¡Se registro el pago correctamente!');
        //generar ticket de pago de multa
      },
      error: err => console.log(err),
      complete: ()=> {
        this.cargarMultasCliente(Number(this.cliente.idclientes));
        //registrar Pago servicio - detalles
        this.regPagosServicio(newMulta);
      }
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

// ************REGISTRAR PAGOSSERVICIO************
  regPagosServicio(multa: Deuda):void {

    // seteando tipo de pago
    let tipoPago: TipoPagoServicio = {
      descripcion: '',
      idtipopagosservicio: 4
    }

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1
    }

    let pagoServicio: PagosServicio = {
      costo: this.costos[0],
      montoapagar: multa.total,
      montotasas: 0.0,
      montodescuento: 0.0,
      montopagado: multa.total,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: 1,
      caja: this.caja,
      cliente: this.cliente,
      tipoPagoServicios: tipoPago,
      pagoServicioEstado: tipoPagoServiciosE,
      deuda: multa
    };

    let pagServDetalles: PagosServicioDetalle[] = this.regPagosDetalle(pagoServicio, multa);

    // registrando pagoServicio (tabla fuerte)
    this.pagosService.savePagosAndDetalles(pagoServicio, pagServDetalles)
    .subscribe({
      next: (resp: any) => {
        let correlativo = Number(resp.pagosservicio.correlativo);
        // this.actualizarEstadoDeuda(this.deudasToUpdate);
        // this.cargarDeudasCliente(Number(this.cliente.idclientes));
        // this.pagar(this.monto); //instanciar TicketPago
        const ticketPago = new TicketMulta(
          correlativo,
          this.cliente,
          multa,
          pagServDetalles
        );

        ticketPago.pagar(String(multa.observacion));

      },
      error: (error) => console.log(error),
      complete: () => {

      },
    });
  }

// ************setear arreglo de detalle de pago************
  regPagosDetalle(pagoServicio: PagosServicio, multa: Deuda):PagosServicioDetalle[]  {
    let pagosServicioDeta: PagosServicioDetalle[] = [{
      idcabecera: 1,
      idmes: moment().month() + 1,
      detalletasas: multa.deudaDescripcion.descripcion,
      idanno: moment().year(),
      monto: multa.total,
      cliente: this.cliente,
      pagosServicio: pagoServicio,
    }];
    return pagosServicioDeta;
  }

  registrarMulta(){
    if(!this.form.valid){
      alert('Indique los datos correctamente');
      return;
    }

    let deudaDescripcion: DeudaDescripcion = {
      descripcion: '',
      iddeudadescripcion: Number(this.form.get('tipoMulta')?.value)
    }

    let deudaEstado: DeudaEstado = {
      iddeudaEstado: 3,
      estado: '',
      valor: '',
    }

    let multaNueva: Deuda = {
      codigo: '1',
      periodo: String(moment().month()),
      total: this.form.get('monto')?.value,
      saldo: this.form.get('monto')?.value,
      vencimiento: moment().format('yyyy-MM-DD') + 30,
      estado: 1,
      cliente: this.cliente,
      deudaDescripcion: deudaDescripcion,
      deudaEstado: deudaEstado,
      observacion: this.form.get('observacion')?.value
    }

    console.log(multaNueva);
  }

}
