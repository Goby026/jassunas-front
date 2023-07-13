import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { Zona } from 'src/app/models/zona.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { ZonaService } from 'src/app/services/zona.service';
import { ByZonaReport } from '../reports/ByZonaReport';

import * as XLSX from 'xlsx';
import * as moment from 'moment';
import 'moment/locale/es';
import { TipoCliente } from 'src/app/models/tipoCliente.model';
moment.locale('es');

@Component({
  selector: 'app-repote-byzona',
  templateUrl: './repote-byzona.component.html'
})
export class RepoteByzonaComponent implements OnInit {

  zonaForm!: FormGroup;
  deudas: Deuda[] = [];
  clientes: Cliente[] = [];
  zonas: Zona[] = [];
  tipoClientes!: TipoCliente[];

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5,10,15,20];

  mostrarTabla: boolean = false;

  constructor(private deudaService: DeudaService,
    private zonasService: ZonaService,
    private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarZonas();
    this.cargarTipoSocios();
  }

  cargarZonas(){
    this.zonasService.listAllZonas()
    .subscribe({
      next: (resp: Zona[])=>this.zonas = resp,
      error: error=>console.log(error),
      // complete: ()=>
    });
  }

  cargarTipoSocios(){
    this.clienteService.getTipoClientes()
    .subscribe({
      next: (resp: TipoCliente[])=> {
        this.tipoClientes = resp
      },
      error: error=>console.log(error),
      // complete: ()=>
    });
  }

  crearFormulario(){
    this.zonaForm = new FormGroup({
      zona: new FormControl(null, Validators.required),
      tiposocio: new FormControl(null, Validators.required),
      // anio: new FormControl(null,Validators.required),
    });
  }

  /* ---------------DEUDAS POR ZONA--------------- */
  fillDeudasZona(){
    if (!this.zonaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.mostrarTabla = true;

    this.deudaService.geDebtsByZone(Number(this.zonaForm.get('zona')?.value))
    .subscribe({
      next: (resp: Deuda[])=>{
        this.deudas = resp
      },
      error: error=>console.log(error),
      complete: ()=> {
        console.log(this.deudas);
      }
    });

  }

  /* ---------------REPORTE PDF--------------- */
  reporte(){
    let subtitulo: Zona[] = this.zonas.filter( (item)=> {
      return item.idtbzonas === Number(this.zonaForm.get('zona')?.value);
    });

    let reporte: ByZonaReport = new ByZonaReport(
      'REPORTE DE CLIENTES POR ZONA',
      `Mostrando datos de clientes de: ${subtitulo[0].detazona}`,
      this.clientes
    );
    reporte.reporte();
  }

  /* DEUDAS DE CLIENTES POR ZONA */
  // deudasByClienteZona(){
  //   if (!this.zonaForm.valid){
  //     alert('Indique parámetros de busqueda correctamente');
  //     return;
  //   }
  // }

  /* ---------------CLIENTES POR ZONA--------------- */
  clientesByZona(){
    console.log(this.zonaForm.value);
    if (!this.zonaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.mostrarTabla = true;

    this.clienteService.listClientsByZona(this.zonaForm.get('zona')?.value)
    .subscribe({
      next: (resp: Cliente[])=>{
        this.clientes = resp.filter( (item: Cliente)=> {
          return item.nombres !== null && item.tipoCliente.idtipocliente === Number(this.zonaForm.get('tiposocio')?.value);
        });
      },
      error: error=>console.log(error),
      complete: ()=> console.log(this.clientes)
    });

  }

  /* ---------------REPORTE EXCEL--------------- */
  excelExport(){

    if(!(this.clientes.length > 0)){
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let zonaTitle: Zona[] = this.zonas.filter( (item)=> {
      return item.idtbzonas == this.zonaForm.get('zona')?.value
    });

    let data: any[] = [...this.clientes];
    let excelData:any[] = data.map( (item: Cliente)=>{
      return {
        id: item.idclientes,
        cliente: `${item.apepaterno} ${item.apematerno} ${item.nombres}`,
        direccion: item.direccion,
        zona: item.zona.detazona,
        estado: item.estado==1?'HABILITADO':'DESHABILITADO'
      }
    });

    const cabeceras = [['ID','CLIENTE', 'DIRECCION', 'ZONA', 'ESTADO']];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Socios');
    XLSX.writeFile(wb, `${zonaTitle[0].detazona} Reporte_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`);

  }

  onTableDataChange( event: any ){
    this.page = event;
    // this.listarCajas();
  }

  onTableSizeChange(event: any):void{
    this.tableSize = event.target.value;
    this.page = 1;
    // this.listarCajas();
  }

}
