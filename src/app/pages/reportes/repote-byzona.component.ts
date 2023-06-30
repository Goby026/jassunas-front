import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { Zona } from 'src/app/models/zona.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { ZonaService } from 'src/app/services/zona.service';
import { ByZonaReport } from '../reports/ByZonaReport';


@Component({
  selector: 'app-repote-byzona',
  templateUrl: './repote-byzona.component.html'
})
export class RepoteByzonaComponent implements OnInit {

  zonaForm!: FormGroup;
  deudas: Deuda[] = [];
  clientes: Cliente[] = [];
  zonas: Zona[] = [];

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
  }

  cargarZonas(){
    this.zonasService.listAllZonas()
    .subscribe({
      next: (resp: Zona[])=>this.zonas = resp,
      error: error=>console.log(error),
      // complete: ()=>
    });
  }

  crearFormulario(){
    this.zonaForm = new FormGroup({
      zona: new FormControl(null, Validators.required),
      // anio: new FormControl(null,Validators.required),
    });
  }

  /* DEUDAS POR ZONA */
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

  /* CLIENTES POR ZONA */
  clientesByZona(){
    if (!this.zonaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.mostrarTabla = true;

    this.clienteService.listClientsByZona(this.zonaForm.get('zona')?.value)
    .subscribe({
      next: (resp: Cliente[])=>{
        console.log(resp);
        this.clientes = resp.filter( (item: Cliente)=> {
          return item.nombres !== null;
        } );
      },
      error: error=>console.log(error)
    });

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
