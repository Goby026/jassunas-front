import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Deuda } from '../models/deuda.model';
import { ClienteService } from '../services/cliente.service';

import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import Swal from 'sweetalert2';

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

  fecha:string = moment().format('MMMM Do YYYY, h:mm:ss a');

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    ) { }

  ngOnInit(): void {
  }

  buscarCliente(dni: HTMLInputElement){
    if (!(dni.value.length === 8)) {
      Swal.fire({
        title: 'Error!',
        text: 'Ingrese dni válido',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }
    this.spinner = true;
    this.clienteService.searchByDni(dni.value)
    .subscribe({
      next: (resp: Cliente)=> {
        this.cliente = resp;
      },
      error: err=> console.log(err),
      complete: ()=> {
        if(this.cliente !== null){
          this.router.navigate(['/datos', this.cliente.idclientes]);
        }else{
          Swal.fire({
            title: 'Error!',
            text: 'Dni no existe',
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
        this.spinner = false
      }
    });
  }

  // mostrarCliente(id: any) {

  //   this.clienteService.getClientById(Number(id)).subscribe({
  //     next: (resp: Cliente) => {
  //       this.cliente = resp;
  //       this.nombre_completo = `${resp.apepaterno} ${resp.apematerno} ${resp.nombres}`;
  //     },
  //     error: (error) => console.log(error),
  //     complete: ()=>{
  //     }
  //   });
  // }


  // cargarDeudasCliente(cliente: Cliente) {
  //   this.busca = false;
  //   this.deudaService.getAllUserDebt(Number(cliente.idclientes))
  //   .subscribe({
  //     next: (resp: Deuda[]) => {
  //       this.deudas = resp.filter((item)=>{
  //         return item.deudaEstado.iddeudaEstado !== 2;
  //       });
  //       this.tblPagos = true;
  //     },
  //     error: (error) => console.log(error),
  //     complete: ()=>{
  //       this.mostrarCliente(cliente.idclientes);
  //     }
  //   });
  // }


  // setearDeuda(sel: HTMLInputElement, deuda: Deuda) {
  //   if (sel.checked) {
  //     this.deudasSel.push(deuda);
  //   }else {

  //     this.deudasSel = this.deudasSel.filter((item) => {
  //       return item.idtbdeudas !== deuda.idtbdeudas;
  //     });

  //   }
  //   this.operar()
  // }

  // operar(){
  //   this.monto = 0;
  //   this.deudasSel.map((item)=>(this.monto += item.saldo));
  // }


  // siguiente(){
  //   if (this.deudasSel.length <= 0){
  //     alert('Seleccione deuda a pagar');
  //     return;
  //   }

  //   let arrDeudasSerializado = JSON.stringify(this.deudasSel);

  //   this.router.navigate(['/confirmar-pago', arrDeudasSerializado, this.cliente.idclientes]);

  // }

}
