import { Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscador-datatable',
  templateUrl: './buscador-datatable.component.html'
})
export class BuscadorDatatableComponent implements OnInit, OnDestroy {

  @Output() salida = new EventEmitter<{cliente:Cliente, panel:string}>;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  clientes: Cliente[] = [];
  cliente!: Cliente;

  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }

    this.listarClientes();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  listarClientes(): void{
    this.clienteService.listClients()
    .subscribe({
      next: ( resp:Cliente[] )=>{
        this.clientes = resp.filter( (item)=> {
          return item.estado != 0
        } )
      },
      error: error=>console.log('ERROR->', error),
      complete: ()=>{
        this.dtTrigger.next(null);
      }
    });
  }

  enviarCliente(cli: Cliente): void{
    this.salida.emit({cliente:cli, panel:'x_all'});
  }

}
