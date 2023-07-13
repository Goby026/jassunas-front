import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { DeudaService } from 'src/app/services/deuda.service';

import { CajaService } from 'src/app/services/caja.service';
import { Caja } from 'src/app/models/caja.model';
import { Router } from '@angular/router';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { Costo } from 'src/app/models/costo.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html'
})
export class CobranzasComponent implements OnInit {

  @ViewChild('closeModal') closeModal!: ElementRef;

  // tipoBusqueda = 'Nombre';
  // isDisabled = false;

  idCliente: number = 0;
  nombre_completo: string = '';
  direccion: string = '';
  zona: string = '';
  tipoCliente: string = '';
  num_familias: string = '';
  num_instalaciones: string = '';
  tarifa: number = 0;

  usuario!: Usuario;
  clientes: Cliente[] = [];

  caja!: Caja;
  cliente!: Cliente;


  costos!: Costo[];
  deudas: Deuda[] = [];



  panel_pagos: boolean = false;
  panel_tributos: boolean = false;
  panel_historial: boolean = false;
  panel_condonacion: boolean = false;
  panel_adelantos: boolean = false;
  // spinner: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private cajaService: CajaService,
    private deudaService: DeudaService,
    private costoService: CostoService,
    private usuarioService: UsuarioService,
    // public dateService: DateService,
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
    // this.monto = 0;
    // this.pagos = [];
  }

  mostrarCliente(cli : any) {
    // console.log(cli);
    // this.cargarCostosCliente(cli.cliente.idclientes);

    //this.setPaneles(cli.panel); //debe emitir el id de cliente para cambiar el router-outlet

    // this.monto = 0;
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
        this.cargarCostosCliente(this.idCliente);
        // cerrar modal de clientes
        this.closeModal.nativeElement.click();
      }
    });
    this.cargarDeudasCliente(Number(cli.cliente.idclientes));
    this.clientes = [];
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

  cargarDeudasCliente(idCliente: number) {
    this.deudaService.getUserDebt(idCliente)
    .subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp;
      },
      error: (error) => console.log(error),
    });
  }

  quitarRouter(idcliente: number){
    if(idcliente > 0){
      this.router.navigate(['/dashboard/cobranzas']);
    }else{
      console.log('Mantener el router', idcliente);
    }
  }
}
