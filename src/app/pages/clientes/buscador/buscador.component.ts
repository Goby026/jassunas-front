import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html'
})
export class BuscadorComponent implements OnInit {

  // @Output() clientesSalida: EventEmitter<> = new EventEmitter();
  @Output() salida = new EventEmitter<{clientes:Cliente[], panel:string}>;

  tipoBusqueda = 'Apellido';
  clientes: Cliente[] = [];
  cliente!:Cliente;
  nombre_completo: string = '';
  spinner: boolean = false;

  cadena: string = '';

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
  }

  buscarCliente(param: HTMLInputElement) {
    this.spinner = true;
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
    // this.monto = 0;
    this.clienteService
      .findClients(paramVal.nombre, paramVal.dni, paramVal.ape)
      .subscribe({
        next: (resp: any) => {
          this.clientes = resp.clientes;
        },
        error: (error) => console.log(error),
        complete: () => {
          // param.value = '';
          this.salida.emit({clientes:this.clientes, panel:'x_all'});
        },
      });
  }

  // mostrarCliente(id: any) {

  //   this.clienteService.getClientById(id).subscribe({
  //     next: (resp: Cliente) => {
  //       this.cliente = resp;
  //       this.nombre_completo = `${resp.apepaterno} ${resp.apematerno} ${resp.nombres}`;
  //     },
  //     error: (error) => console.log(error)
  //   });
  //   this.clientes = [];
  // }


  buscar(){
    if (this.cadena.trim().length <= 0) {
      alert('ingrese nombre');
      return;
    }

    this.clienteService.buscarClientes(this.cadena)
    .subscribe({
      next: (resp: Cliente[]) => {
        this.clientes = resp;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.salida.emit({clientes:this.clientes, panel:'x_all'});
      }
    });
  }

}
