import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Deuda } from '../models/deuda.model';
import { ClienteService } from '../services/cliente.service';
import { DeudaService } from '../services/deuda.service';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-subir-pago',
  templateUrl: './subir-pago.component.html',
  styleUrls: [
    './../../assets/vendor/css/pages/page-auth.css',
    './../../assets/vendor/css/core.css',
    './../../assets/vendor/css/theme-default.css',
    './../../assets/css/demo.css',
  ]
})
export class SubirPagoComponent implements OnInit {

  spinner: boolean = false;
  clientes!: Cliente[];
  cliente!: Cliente;
  deudas!: Deuda[];
  deudasSel: Deuda[] = [];
  nombre_completo: string = '';
  tipoBusqueda: string = 'Nombre';
  monto: number = 0;
  tblPagos: boolean = false;
  busca: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private deudaService: DeudaService,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  buscarCliente(param: HTMLInputElement) {

    if(param.value.trim() === ''){
      return;
    }

    this.spinner = true;
    this.busca = true;
    let paramVal = {
      nombre: '',
      dni: '',
      ape: '',
    };
    switch (this.tipoBusqueda) {
      case 'Nombre':
        paramVal = {
          nombre: param.value,
          dni: '',
          ape: '',
        };
        break;
      case 'Dni':
        paramVal = {
          nombre: '',
          dni: param.value,
          ape: '',
        };
        break;
      case 'Apellido':
        paramVal = {
          nombre: '',
          dni: '',
          ape: param.value,
        };
        break;
      default:
        break;
    }
    this.monto = 0;
    this.clienteService
      .findClients(paramVal.nombre, paramVal.dni, paramVal.ape)
      .subscribe({
        next: (resp: any) => {
          this.clientes = resp.clientes;
        },
        error: (error) => console.log(error),
        complete: () => {
          this.monto = 0;
          this.spinner = false
        },
      });
  }

  mostrarCliente(id: any) {
    // this.panel_pagos = true;
    // this.panel_condonacion = true;
    // this.idCliente = id;

    // console.log(JSON.stringify(this.idCliente, null, 2));

    this.clienteService.getClientById(Number(id)).subscribe({
      next: (resp: Cliente) => {
        this.cliente = resp;
        this.nombre_completo = `${resp.apepaterno} ${resp.apematerno} ${resp.nombres}`;
      },
      error: (error) => console.log(error),
      complete: ()=>{
        // cargar costos del cliente
        // this.cargarCostosCliente(id);
        // this.cargarDeudasCliente(id);
      }
    });
  }


  cargarDeudasCliente(cliente: Cliente) {
    this.busca = false;
    this.deudaService.getUserDebt(Number(cliente.idclientes))
    .subscribe({
      next: (resp: Deuda[]) => {
        this.deudas = resp.map((item)=>{
          return item;
        });
        this.tblPagos = true;
      },
      error: (error) => console.log(error),
      complete: ()=>{
        this.mostrarCliente(cliente.idclientes);
      }
    });
  }


  setearDeuda(sel: HTMLInputElement, deuda: Deuda) {
    if (sel.checked) {
      this.deudasSel.push(deuda);
    }else {

      this.deudasSel = this.deudasSel.filter((item) => {
        return item.idtbdeudas !== deuda.idtbdeudas;
      });

    }
    this.operar()
  }

  operar(){
    this.monto = 0;
    this.deudasSel.map((item)=>(this.monto += item.saldo));
  }


  siguiente(){
    if (this.deudasSel.length <= 0){
      alert('Seleccione deuda a pagar');
      return;
    }

    let arrDeudasSerializado = JSON.stringify(this.deudasSel);

    this.router.navigate(['/confirmar-pago', arrDeudasSerializado, this.cliente.idclientes]);

  }

}
