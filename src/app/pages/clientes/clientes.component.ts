import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  title='Lista de clientes';
  cliente: any = {};
  clientes:any[] = [];
  panel: boolean = false;

  page: number = 1;
  count: number = 0;
  tableSize: number = 15;
  tableSizes: number[] = [5,10,15,20];

  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(){
    this.clienteService.listClients()
    .subscribe({
      next: ( resp:any )=>{
        console.log('data--->', resp);
        this.clientes = resp.clientes;
      },
      error: error=>console.log('ERROR->', error),
      complete: ()=> console.log('petición completa')
    });
  }


  onTableDataChange( event: any ){
    this.page = event;
    this.listarClientes();
  }

  onTableSizeChange(event: any):void{
    this.tableSize = event.target.value;
    this.page = 1;
    this.listarClientes();
  }


  editarCliente(dataCliente: any){
    this.panel = true;
    this.cliente = dataCliente;
  }

}
