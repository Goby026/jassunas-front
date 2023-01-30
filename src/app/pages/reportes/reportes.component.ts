import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { Zona } from 'src/app/models/zona.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { ZonaService } from 'src/app/services/zona.service';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { RequisitoService } from 'src/app/services/requisito.service';
import { Requisito } from 'src/app/models/requisito.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  clientePanel: boolean = false;
  zonaPanel: boolean = false;
  tupaPanel: boolean = false;
  pagoPanel: boolean = false;

  clientes: Cliente[] = [];
  zonas: Zona[] = [];
  requisitos: Requisito[] = [];
  deudas: Deuda[] = [];
  pagosDetalles: PagosServicioDetalle[] = [];

  clienteForm!: FormGroup;
  zonaForm!: FormGroup;
  tupaForm!: FormGroup;
  pagosForm!: FormGroup;

  nombre_completo: string = '';

  constructor(
    private clienteService: ClienteService,
    private zonasService: ZonaService,
    private requisitosService: RequisitoService,
    private deudaService: DeudaService,
    private pagosService: PagosServiciosService,) {}

  ngOnInit(): void {
    this.cargarZonas();
    this.cargarRequisitos();
    this.crearFormularios();
  }

  getMes(){
    let mes = 3;
    let mesNombre = moment().month(mes-1).format('MMMM');
    console.log(mesNombre);
  }

  crearFormularios(){

    this.clienteForm = new FormGroup({
      cinicio: new FormControl(null, Validators.required),
      cfin: new FormControl(null, Validators.required)
    });

    this.zonaForm = new FormGroup({
      zona: new FormControl(null, Validators.required),
      anio: new FormControl(null,Validators.required),
    });

    this.tupaForm = new FormGroup({
      tupa: new FormControl(null, Validators.required),
      tinicio: new FormControl(null,Validators.required),
      tfin: new FormControl(null,Validators.required),
    });

    this.pagosForm = new FormGroup({
      inicio: new FormControl(null, Validators.required),
      fin: new FormControl(null,Validators.required),
    });
  }

  selOpc(e:HTMLSelectElement){
    switch (e.value) {
      case 'cliente':
        this.clientePanel = true;
        this.zonaPanel = false;
        this.tupaPanel = false;
        this.pagoPanel = false;
        break;
      case 'zona':
        this.clientePanel = false;
        this.zonaPanel = true;
        this.tupaPanel = false;
        this.pagoPanel = false;
        break;
      case 'tupa':
        this.clientePanel = false;
        this.zonaPanel = false;
        this.tupaPanel = true;
        this.pagoPanel = false;
        break;
      case 'pago':
        this.clientePanel = false;
        this.zonaPanel = false;
        this.tupaPanel = false;
        this.pagoPanel = true;
        break;

      default:
        break;
    }
  }

  cargarZonas(){
    this.zonasService.listAllZonas()
    .subscribe({
      next: (resp: Zona[])=>this.zonas = resp,
      error: error=>console.log(error),
      // complete: ()=>
    });
  }

  cargarRequisitos(){
    this.requisitosService.getAllRequisitos()
    .subscribe({
      next: (resp: Requisito[])=>this.requisitos = resp,
      error: error=>console.log(error)
    });
  }

  reporteDeudasCliente(){
    if (!this.clienteForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }
  }


  reporteDeudasZonaAnio(){
    if (!this.zonaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.deudaService.geDebtsByZoneAndYear(this.zonaForm.get('zona')?.value, this.zonaForm.get('anio')?.value)
    .subscribe({
      next: (resp: Deuda[])=>this.deudas = resp,
      error: error=>console.log(error),
      // complete: ()=> console.log('completo')
    });

  }

  reportePagosPorTupa(){
    if (!this.tupaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }
  }

  reportePagosPorFechas(){
    if (!this.pagosForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.pagosService.getDetallePagoFechas(this.pagosForm.get('inicio')?.value, this.pagosForm.get('fin')?.value)
    .subscribe({
      next: (resp: PagosServicioDetalle[])=>this.pagosDetalles = resp,
      error: error=>console.log(error),
      // complete: ()=> console.log('completo')
    });
  }

}
