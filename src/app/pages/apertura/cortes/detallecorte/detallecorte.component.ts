import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/es';
import { Cliente } from 'src/app/models/cliente.model';
import { Deuda } from 'src/app/models/deuda.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';
moment.locale('es');

@Component({
  selector: 'app-detallecorte',
  templateUrl: './detallecorte.component.html'
})
export class DetallecorteComponent implements OnInit {

  deudas: Deuda [] = [];
  clientes: Cliente[] = [];
  mes = moment().format('MMMM');
  year = moment().format('yyyy');
  total: number = 0.0;
  porcentaje: number = 0.0;
  cargando: boolean = false;

  constructor(private deudaService: DeudaService, private clienteService: ClienteService) { }

  ngOnInit(): void {
    console.log('cargando deudas');
    this.generarDeudas();
  }

  generarDeudas(){
    console.log('ejecutando metodo para obtener deudas');
    this.cargando = true;
    this.deudaService.generateDebt()
    .subscribe({
      next: (resp: Deuda[])=> this.deudas = resp.filter( deuda => deuda.cliente.nombres != ''),
      error: err=> console.log(err),
      complete: ()=> {
        console.log(this.deudas);
        this.cargando = false;
        this.deudas.map( (resp)=> {
          this.total += resp.saldo
        } );
        this.obtenerClientes();
      }
    });
  }

  obtenerClientes(){
    console.log('obteniendo clientes');
    this.clienteService.listClients()
    .subscribe({
      next: (resp: Cliente[])=> this.clientes = resp,
      error: err=> console.log(err),
      complete: ()=> {
        this.porcentaje = this.clientes.length / this.total;
      }
    });
  }

}
