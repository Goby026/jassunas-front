import { Component, Input, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { DeudaService } from 'src/app/services/deuda.service';


@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {

  loadedFeature = '';

  title='Cobranza de servicios';
  cliente: any = {};
  clientes:any[] = [];
  // deuda = {};
  deudas: any[] = [];
  idCliente: number = 0;
  idCosto: number = 0;
  panel_cliente_data:boolean=false;
  panel_montos:boolean=true;

  monto: number = 0;
  prop: number = 0;

  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: number[] = [5,10,15,20];

  constructor( private clienteService: ClienteService, private deudaService: DeudaService, private costoService: CostoService ) { }

  ngOnInit(): void {
  }

  onTableDataChange( event: any ){
    this.page = event;
  }

  onTableSizeChange(event: any):void{
    this.tableSize = event.target.value;
    this.page = 1;
  }

  buscarCliente(nombres: any){
    this.cerrarPanel();
    this.clienteService.findClients(nombres.value)
    .subscribe({
      next: ( resp:any )=>{
        this.clientes = resp.clientes;
      },
      error: error => console.log(error)
    });
  }

  mostrarCliente(id: number){

    this.idCliente = id;
    this.cerrarPanel();
    this.panel_cliente_data = true;
    this.clientes = [];
  }



  cargarPrePagados(){

  }


  // operarMonto(e: any){
  //   if (e.target.checked) {
  //     this.sub_total += Number(e.target.value);
  //   } else {
  //     this.sub_total -= Number(e.target.value);
  //   }
  // }


  // verCliente(){
  //   this.panel_cliente_data = true;
  // }

  // verPagosDeudasCondo(){
  //   this.panel_pagos_dc = true;
  // }

  recibirDeuda($event: any){
    // this.monto += $event.total;
    this.panel_montos=true;
    this.deudas.push($event);
    this.prop += 1;
  }

  cerrarPanel(){
    this.cliente = {};
    this.monto = 0;
    this.panel_cliente_data = false;
    this.loadedFeature = '';
  }

  onNavigate($event: string) {

    this.prop = 0;

    if ($event === '') {
      throw new Error('Method not implemented.');
      return;
    }

    this.loadedFeature = $event;
  }

  getCodCosto($event: number) {
    this.idCosto = $event;
  }

}
