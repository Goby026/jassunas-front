import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';

import { CajaService } from 'src/app/services/caja.service';
import { Caja } from 'src/app/models/caja.model';
import { Router } from '@angular/router';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { ItemTicket } from 'src/app/interfaces/items-ticket-interface';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { Costo } from 'src/app/models/costo.model';
import { TipoPagoServicio } from 'src/app/models/tipopagoservicio.model';
import { PagoServicioEstado } from 'src/app/models/pagoservicioestado.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css'],
})
export class CobranzasComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  tipoBusqueda = 'Nombre';
  isDisabled = false;

  idCliente: number = 0;
  nombre_completo: string = '';
  direccion: string = '';
  zona: string = '';
  tipoCliente: string = '';
  num_familias: string = '';
  num_instalaciones: string = '';
  tarifa: number = 0;
  correlativo: number = 0;

  clientes: Cliente[] = [];
  usuario!: Usuario;

  deudas: Deuda[] = [];
  deudasToUpdate: Deuda[] = [];
  pagos: ItemTicket[] = [];
  monto: number = 0;
  caja!: Caja;
  cliente!: Cliente;
  costos!: Costo[];

  panel_pagos: boolean = false;
  panel_tributos: boolean = false;
  panel_historial: boolean = false;
  panel_condonacion: boolean = false;
  panel_adelantos: boolean = false;
  spinner: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    private cajaService: CajaService,
    private costoService: CostoService,
    private pagosService: PagosServiciosService,
    private usuarioService: UsuarioService,
    public dateService: DateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarEstadoCaja();
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

  buscarCliente(params: any): void {
    this.clientes = params.clientes;
    this.monto = 0;
    this.pagos = [];
  }

  mostrarCliente(cli : any) {
    this.panel_pagos = false;
    this.panel_condonacion = true;
    this.monto = 0;
    this.idCliente = Number(cli.cliente.idclientes);

    // console.log(JSON.stringify(this.idCliente, null, 2));

    this.clienteService.getClientById(Number(cli.cliente.idclientes)).subscribe({
      next: (resp: Cliente) => {
        this.cliente = resp;
        this.nombre_completo = `${resp.apepaterno} ${resp.apematerno} ${resp.nombres}`;
      },
      error: (error) => console.log(error),
      complete: ()=>{
        // cargar costos del cliente
        this.cargarCostosCliente(Number(cli.cliente.idclientes));
        // cerrar modal de clientes
        this.closeModal.nativeElement.click();
      }
    });
    this.cargarDeudasCliente(Number(cli.cliente.idclientes));
    this.clientes = [];
  }

  cargarDeudasCliente(idCliente: number) {
    this.deudaService.getUserDebt(idCliente)
    .subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp;
      },
      error: (error) => console.log(error),
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

  // metodo para registrar entidad PagosServicio
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
      montoapagar: this.monto,
      montotasas: 0.0,
      montodescuento: 0.0,
      montopagado: this.monto,
      fecha: moment().toDate(),
      usuario: this.usuario,
      esta: 1,
      correlativo: 1,
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
        this.cargarDeudasCliente(this.idCliente);
        this.pagar(this.monto);
      },
      error: (error) => console.log(error),
      complete: () => {
        // actualizar estado de las deudas pagadas

        this.pagos=[];
        this.deudasToUpdate=[];
        this.monto = 0.0;
        this.isDisabled = false;
      },
    });
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  async pagar(montoPagado: number) {
    let dataPagos: any[] = [];

    this.pagos.map((item: ItemTicket) => {
      let arrItem = [
        'MANTENIMIENTO',
        item.fecha,
        `S/ ${item.monto}`,
      ];
      dataPagos.push(arrItem);
    });

    // crear pdf
    const pdfDefinition: any = {
      pageSize: {
        width: 235, //B7 - B8
        height: 'auto',
      },
      pageMargins: [20, 30, 20, 30],
      content: [
        {
          image: await this.getBase64ImageFromURL(
            '../../../assets/img/jass.png'
          ),
          width: 90,
          alignment: 'center',
        },
        {
          text: 'JUNTA ADMINISTRADORA DE SERVICIOS DE SANEAMIENTO',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 8],
        },
        {
          text: 'Av. 30 de Mayo # 250 - Plaza Principal',
          alignment: 'center',
          style: 'small',
        },
        {
          text: 'JUNIN - HUANCAYO - HUANCAYO',
          alignment: 'center',
          style: 'small',
        },
        {
          text: `RECIBO DE CUOTA FAMILIAR Nro. 000${this.correlativo}`,
          alignment: 'center',
          style: 'header',
          margin: [0, 8],
        },
        // {
        //   text: `
        //   Cliente: \t\t ${this.idCliente} - ${this.nombre_completo}\n
        //   Direccion: \t\t ${this.direccion} \n
        //   Fecha: \t\t ${new Date()}`,
        //   style: 'small',
        //   margin: [0, 8]
        // },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Cliente:',
              style: 'small',
              width: 50,
            },
            {
              text: `${this.idCliente} - ${this.nombre_completo}`,
              style: 'small',
              // width: 60,
            },
          ],
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Direccion:',
              style: 'small',
              width: 50,
            },
            {
              text: `${this.cliente.direccion}`,
              style: 'small',
              // width: 60,
            },
          ],
        },
        {
          alignment: 'justify',
          columns: [
            {
              text: 'Fecha:',
              style: 'small',
              width: 50,
            },
            {
              text: `${moment().format('DD-MM-YYYY hh:mm:ss')}`,
              style: 'small',
              // width: 60,
            },
          ],
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 40, 40],
            body: [['CONCEPTOS', 'MES', 'S.TOTAL'], ...dataPagos],
          },
        },
        {
          text: `SON: ${montoPagado} con 00/100 SOLES`,
          alignment: 'left',
          style: 'small',
          margin: [0, 8],
        },
        {
          text: `
            SUBTOTAL: \t\t S/ ${montoPagado}.00 \n
            TASAS: \t\t S/ 0.00 \n
            DESCUENTO: \t\t S/ 0.00 \n
            ________________________ \n
          `,
          alignment: 'right',
          style: 'small',
          margin: [0, 8],
        },
        {
          text: `TOTAL A PAGAR: \t\t S/ ${montoPagado}.00`,
          alignment: 'right',
          style: 'subheader',
          margin: [0, 8],
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
        },
        quote: {
          italics: true,
        },
        small: {
          fontSize: 8,
        },
        tableExample: {
          fontSize: 8,
          margin: [0, 0, 0, 0],
        },
      },
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  // metodo para registrar los detalles del pago (tabla dependiente)
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
      complete: () => this.cargarDeudasCliente(this.idCliente),
    });
  }

  setPago(deudaSel: HTMLInputElement, deuda: Deuda) {

    let itemDeuda: ItemTicket = {
      concepto: 'MANTENIMIENTO',
      // fecha: moment(deuda.periodo).format('MM-YYYY'),
      fecha: this.dateService.getMes( Number(moment(deuda.periodo).month())) + " - "+ moment(deuda.periodo).year(),
      nmes: moment(deuda.periodo).month() + 1,
      nannio: moment(deuda.periodo).year(),
      monto: deuda.total,
      id: deuda.idtbdeudas
    };

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
    this.pagos.map((item) => {
      this.monto += Number(item.monto);
    });
  }

  condonarDeuda() {
    // console.log('PAGOS---->', this.pagos);

    if (this.pagos.length <= 0 || this.monto === 0) {
      alert('Nada por condonar');
      return;
    }

    this.panel_condonacion = true;
  }

  setPaneles(opc: string) {
    if (this.costos.length <= 0) {
      alert('El cliente seleccionado no tiene configurado sus costos');
      return;
    }
    switch (opc) {
      case 'o_pagos':
        this.panel_pagos = true;
        this.panel_tributos = false;
        this.panel_historial = false;
        this.panel_condonacion = false;
        this.panel_adelantos = false;
        break;
      case 'o_tributos':
        this.panel_pagos = false;
        this.panel_tributos = true;
        this.panel_historial = false;
        this.panel_condonacion = false;
        this.panel_adelantos = false;
        break;
      case 'o_historial':
        this.panel_pagos = false;
        this.panel_tributos = false;
        this.panel_historial = true;
        this.panel_condonacion = false;
        this.panel_adelantos = false;
        break;
      case 'o_condonacion':
        this.panel_pagos = false;
        this.panel_tributos = false;
        this.panel_historial = false;
        this.panel_condonacion = true;
        this.panel_adelantos = false;
        break;
      case 'o_adelantos':
        this.panel_pagos = false;
        this.panel_tributos = false;
        this.panel_historial = false;
        this.panel_condonacion = false;
        this.panel_adelantos = true;
        break;
      case 'x_all':
        this.panel_pagos = false;
        this.panel_tributos = false;
        this.panel_historial = false;
        this.panel_condonacion = false;
        this.panel_adelantos = false;
        this.idCliente = 0;
        this.nombre_completo = '';
        this.direccion = '';
        this.zona = '';
        this.tipoCliente = '';
        this.num_familias = '';
        this.num_instalaciones = '';
        this.tarifa = 0;
        this.clientes = [];
        this.deudas = [];
        this.pagos = [];
        this.monto = 0;
        break;
      default:
        this.panel_pagos = false;
        this.panel_tributos = false;
        this.panel_historial = false;
        this.panel_condonacion = false;
        this.panel_adelantos = false;
        break;
    }
  }
}
