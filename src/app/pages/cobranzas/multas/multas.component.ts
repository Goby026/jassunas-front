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
import Swal from 'sweetalert2';

import * as moment from 'moment';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { TicketMulta } from '../TicketMulta';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
})
export class MultasComponent implements OnInit {
  caja!: Caja;
  cliente!: Cliente;
  usuario!: Usuario;
  multas!: Deuda[];
  tipoMultas!: DeudaDescripcion[];
  tipoMulta: string = '';
  costos!: Costo[];
  deuda!: Deuda;

  nuevo: boolean = true;

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
  ) {}

  ngOnInit(): void {
    const { idCliente } = this.activatedRoute.snapshot.params;
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
        } else {
          alert('No hay resultado de cobranzas');
        }
      },
      error: (error) => console.log(error),
      complete: () => {
        this.usuario = this.usuarioService.getLocalUser();
      },
    });
  }

  crearFormulario() {
    this.form = new FormGroup({
      tipoMulta: new FormControl(1, Validators.required),
      monto: new FormControl(0.0, Validators.required),
      observacion: new FormControl(null),
    });
  }

  cargarCliente(id: number) {
    this.clienteService.getClientById(id).subscribe({
      next: (resp: Cliente) => (this.cliente = resp),
      error: (error) => console.log(error),
      complete: () => {
        this.cargarMultasCliente(Number(this.cliente.idclientes));
        this.cargarCostosCliente(Number(this.cliente.idclientes));
      },
    });
  }

  cargarMultasCliente(id: number) {
    this.deudaService.getAllUserDebt(id).subscribe({
      next: (resp: Deuda[]) => {
        this.multas = resp.filter((multa) => {
          return (
            (multa.deudaDescripcion.iddeudadescripcion == 3 ||
              multa.deudaDescripcion.iddeudadescripcion == 4 ||
              multa.deudaDescripcion.iddeudadescripcion == 5) &&
            multa.deudaEstado.iddeudaEstado == 3
          );
        });
      },
      error: (error) => console.log(error),
    });
  }

  cargarTiposMulta() {
    this.form.reset();
    this.multaForm = true;
    this.deudaService.getAllDeudaDescripcion().subscribe({
      next: (resp: DeudaDescripcion[]) => {
        this.tipoMultas = resp.filter((tipo) => {
          return tipo.estado != 0;
        });
      },
      error: (error) => console.log(error),
      // complete: ()=> console.log(this.tipoMultas)
    });
  }

  pagarDeuda(multa: Deuda) {
    if (!confirm('¿Cancelar deuda?')) {
      return;
    }

    let newMulta: Deuda = { ...multa };

    let newDeudaEstado: DeudaEstado = { ...multa.deudaEstado };
    newDeudaEstado.iddeudaEstado = 2;

    newMulta.estado = 2;
    newMulta.saldo = 0;
    newMulta.deudaEstado = newDeudaEstado;
    newMulta.observacion = multa.observacion;

    this.deudaService.updateUserDebt(newMulta).subscribe({
      next: (resp: Deuda) => {
        if (resp) {
          Swal.fire({
            title: 'Hecho!',
            text: `Se registró correctamente el pago`,
            icon: 'success',
          });
        }
        //generar ticket de pago de multa
      },
      error: (err) => console.log(err),
      complete: () => {
        this.cargarMultasCliente(Number(this.cliente.idclientes));
        //registrar Pago servicio - detalles
        this.regPagosServicio(newMulta);
      },
    });
  }

  // ************OBTENER COSTO DE CLIENTE************
  cargarCostosCliente(idCli: number) {
    this.costoService.getCostsByClient(idCli).subscribe({
      next: (resp: Costo[]) => {
        this.costos = resp;
      },
      error: (error) => console.log(error),
    });
  }

  // ************REGISTRAR PAGOSSERVICIO************
  regPagosServicio(multa: Deuda): void {
    // seteando tipo de pago
    let tipoPago: TipoPagoServicio = {
      descripcion: '',
      idtipopagosservicio: 4,
    };

    // seteando estado de pago
    let tipoPagoServiciosE: PagoServicioEstado = {
      descripcion: null,
      idpagoestado: 1,
    };

    let pagoServicio: PagosServicio = {
      costo: this.costos[0],
      montoapagar: multa.total,
      montotasas: 0.0,
      montodescuento: 0.0,
      montopagado: multa.total,
      fecha: moment().format('yyyy-MM-DD'),
      usuario: this.usuario,
      esta: 1,
      correlativo: null,
      caja: this.caja,
      cliente: this.cliente,
      tipoPagoServicios: tipoPago,
      pagoServicioEstado: tipoPagoServiciosE,
      deuda: multa,
    };

    let pagServDetalles: PagosServicioDetalle[] = this.regPagosDetalle(
      pagoServicio,
      multa
    );

    // registrando pagoServicio (tabla fuerte)
    this.pagosService
      .savePagosAndDetalles(pagoServicio, pagServDetalles)
      .subscribe({
        next: (resp: any) => {
          let correlativo = Number(resp.pagosservicio.correlativo);
          const ticketPago = new TicketMulta(
            correlativo,
            this.cliente,
            multa,
            pagServDetalles
          );

          ticketPago.pagar(String(multa.observacion));
        },
        error: (error) => console.log(error),
        complete: () => {},
      });
  }

  // ************setear arreglo de detalle de pago************
  regPagosDetalle(
    pagoServicio: PagosServicio,
    multa: Deuda
  ): PagosServicioDetalle[] {
    let pagosServicioDeta: PagosServicioDetalle[] = [
      {
        idcabecera: 1,
        idmes: moment().month() + 1,
        detalletasas: multa.deudaDescripcion.descripcion,
        idanno: moment().year(),
        monto: multa.total,
        cliente: this.cliente,
        pagosServicio: pagoServicio,
      },
    ];
    return pagosServicioDeta;
  }

  getTipoMulta() {
    this.tipoMultas.filter((item) => {
      item.iddeudadescripcion == this.form.get('tipoMulta')?.value
        ? (this.tipoMulta = item.descripcion)
        : '';
    });
  }

  registrarMulta() {
    if (!this.form.valid) {
      Swal.fire({
        title: 'Error!',
        text: 'Indique los datos correctamente',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });

      return;
    }

    Swal.fire({
      title: '¿Registrar penalidad?',
      text: 'El historial del socio no se podrá modificar luego!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, confirmar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let deudaDescripcion: DeudaDescripcion = {
          descripcion: this.tipoMulta,
          iddeudadescripcion: Number(this.form.get('tipoMulta')?.value),
        };

        let deudaEstado: DeudaEstado = {
          iddeudaEstado: 3,
          estado: '',
          valor: '',
        };

        let multaNueva: Deuda = {
          codigo: '1',
          periodo: String(moment().format('yyyy-MM-DD')),
          total: this.form.get('monto')?.value,
          saldo: this.form.get('monto')?.value,
          vencimiento: moment().add(30, 'days').format('yyyy-MM-DD'),
          estado: 1,
          cliente: this.cliente,
          deudaDescripcion: deudaDescripcion,
          deudaEstado: deudaEstado,
          dcto: 0.0,
          observacion: this.form.get('observacion')?.value,
        };

        //TODO: registrar deuda de tipo multa
        this.deudaService.saveUserDebt(multaNueva).subscribe({
          next: (resp: Deuda) => {
            this.deuda = resp;
          },
          error: (err) => console.log(err),
          complete: () => {
            // this.regPagosServicio(this.deuda);
            this.cargarMultasCliente(Number(this.cliente.idclientes));
            this.form.reset();
            this.multaForm = false;
          },
        });
      } else {
        return;
      }
    });

    // console.log(multaNueva);
  }

  editar(multa: Deuda) {
    this.nuevo = false;
    console.log(this.nuevo);
    this.multaForm = true;
    this.cargarTiposMulta();
    this.form.controls['tipoMulta'].setValue(
      multa.deudaDescripcion.iddeudadescripcion
    );
    this.form.controls['monto'].setValue(multa.saldo);
    this.form.controls['observacion'].setValue(multa.observacion);

    this.deuda = multa;
  }

  actualizarDeuda() {
    Swal.fire({
      title: '¿Modificar datos?',
      text: 'Verifique información antes de continuar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let editedMulta: Deuda = { ...this.deuda };

        editedMulta.deudaDescripcion.iddeudadescripcion =
          this.form.get('tipoMulta')?.value;

        editedMulta.saldo = this.form.get('monto')?.value;

        editedMulta.observacion = this.form.get('observacion')?.value;

        this.deudaService.updateUserDebt(editedMulta).subscribe({
          next: () => {},
          error: (err) => console.log(err),
          complete: () => {
            this.cargarMultasCliente(Number(this.cliente.idclientes));
            this.form.reset();
            this.multaForm = false;
          },
        });

        Swal.fire('Modificado!', 'La multa se editó correctamente.', 'success');
      } else {
        return;
      }
    });
  }

  anular(multa: Deuda) {
    Swal.fire({
      title: '¿Anular multa?',
      text: 'No se podra revertir la anulación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, anular!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Modificar');

        multa.deudaEstado.iddeudaEstado = 1;

        this.deudaService.updateUserDebt(multa).subscribe({
          next: () => {},
          error: (err) => console.log(err),
          complete: () => {
            this.cargarMultasCliente(Number(this.cliente.idclientes));
            this.form.reset();
            this.multaForm = false;
          },
        });

        Swal.fire('Anulado!', 'La multa fue anulada correctamente.', 'success');
      } else {
        return;
      }
    });
  }
}
