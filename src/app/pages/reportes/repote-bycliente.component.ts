import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { Zona } from 'src/app/models/zona.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { ZonaService } from 'src/app/services/zona.service';
import { ByClienteReport } from '../reports/ByClienteReport';

@Component({
  selector: 'app-repote-bycliente',
  templateUrl: './repote-bycliente.component.html',
})
export class RepoteByclienteComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  clienteForm!: FormGroup;

  deudas: Deuda[] = [];

  findCliente: boolean = false;
  tblData: boolean = false;

  zonas!: Zona[];
  idZona: number = 0;
  idCliente: number = 0;
  cbZona!:HTMLInputElement;

  cliente!:Cliente;
  nombre_completo: String="";

  mostrarZonas: boolean = false;
  buscarCliente: boolean = false;

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5,10,15,20];


  constructor(
    private deudaService: DeudaService,
    private zonaService: ZonaService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario() {
    this.clienteForm = new FormGroup({
      cinicio: new FormControl(null, Validators.required),
      cfin: new FormControl(null, Validators.required),
    });
  }

  reporteDeudas(){

    if (this.mostrarZonas) {
      this.fillDeudasPorZona();
    }else if(this.buscarCliente){
      if (!this.cliente) {
        alert('Seleccionar cliente 👀');
        return;
      }
      this.fillDeudasPorCliente();
    }else{
      alert('Indique correctamente parámetros de reporte');
        return;
    }
  }

  fillDeudasPorZona() {
    if (!this.clienteForm.valid) {
      alert('Indique parámetros de busqueda correctamente');
      return;
    } else if (this.idZona <= 0) {
      alert('Zona no es válida');
      return;
    }

    this.tblData = true;

    this.deudaService
      .geDebtsByZoneAndDateRange(this.idZona, this.clienteForm.get('cinicio')?.value, this.clienteForm.get('cfin')?.value)
      .subscribe({
        next: (resp) => {
          this.deudas = resp;
        },
        error: (err) => console.log(err),
      });
  }

  fillDeudasPorCliente() {
    if (!this.clienteForm.valid) {
      alert('Indique parámetros de búsqueda correctamente');
      return;
    } else if (Number(this.cliente.idclientes) <= 0) {
      alert('Cliente no es válido');
      return;
    }

    this.tblData = true;

    this.deudaService
      .geDebtsByClientAndDateRange(Number(this.cliente.idclientes), this.clienteForm.get('cinicio')?.value, this.clienteForm.get('cfin')?.value)
      .subscribe({
        next: (resp) => {
          this.deudas = resp;
        },
        error: (err) => console.log(err),
      });
  }

  // BOTON REPORTE DEUDA POR ZONA
  reporteByZona(){

    if (this.deudas.length <= 0) {
      alert('No hay contenido, pulse boton MOSTRAR');
      return;
    }

    let reporteZona: ByClienteReport = new ByClienteReport(
      'REPORTE DE DEUDA POR ZONA',
      `Deudas registratas desde ${this.clienteForm.get('cinicio')?.value} hasta ${this.clienteForm.get('cfin')?.value}`,
      this.deudas
    );

    reporteZona.reporte();
  }

    // BOTON REPORTE DEUDA POR CLIENTE
    reporteByCliente(){

      if (this.deudas.length <= 0) {
        alert('No hay contenido, pulse boton MOSTRAR');
        return;
      }

      let reporteZona: ByClienteReport = new ByClienteReport(
        'REPORTE DE DEUDA POR CLIENTE',
        `Deudas registratas desde ${this.clienteForm.get('cinicio')?.value} hasta ${this.clienteForm.get('cfin')?.value}`,
        this.deudas
      );

      reporteZona.reporte();
    }

  setZonaSelect(e1: HTMLInputElement, e2: HTMLInputElement) {
    if (e1.checked) {
      e2.disabled = true;
      this.mostrarZonas = true;
      this.zonaService.listAllZonas().subscribe({
        next: (resp) => (this.zonas = resp),
        error: (err) => console.log(err),
      });
    } else {
      e2.disabled = false;
      this.mostrarZonas = false;
      this.deudas = [];
      return;
    }
  }

  setClienteButton(e1: HTMLInputElement, e2: HTMLInputElement){
    if (e1.checked) {
      e2.disabled = true;
      this.buscarCliente = true;

      // this.zonaService.listAllZonas().subscribe({
      //   next: (resp) => (this.zonas = resp),
      //   error: (err) => console.log(err),
      // });

    } else {
      e2.disabled = false;
      this.buscarCliente = false;
      this.deudas = [];
      return;
    }
  }

  setCodZona(e: HTMLSelectElement) {
    this.idZona = Number(e.value);
  }


  mostrarCliente(cli : any) {
    this.idCliente = Number(cli.cliente.idclientes);

    // console.log(JSON.stringify(this.idCliente, null, 2));

    this.clienteService.getClientById(Number(cli.cliente.idclientes)).subscribe({
      next: (resp: Cliente) => {
        this.cliente = resp;
      },
      error: (error) => console.log(error),
      complete: ()=>{
        this.nombre_completo = `${this.cliente.apepaterno} ${this.cliente.apematerno} ${this.cliente.nombres}`;
        // cerrar modal de clientes
        this.closeModal.nativeElement.click();
      }
    });
    // this.clientes = [];
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
