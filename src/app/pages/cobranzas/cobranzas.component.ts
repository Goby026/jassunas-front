import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { DeudaService } from 'src/app/services/deuda.service';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  styleUrls: ['./cobranzas.component.css']
})
export class CobranzasComponent implements OnInit {

  title='';
  clientes:any[] = [];
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: number[] = [5,10,15,20];

  panel: boolean= false;

  deudas:any[] = [];
  deudaTotal: string = '';

  constructor( private clienteService: ClienteService, private deudaService: DeudaService ) { }

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

  mostrarCliente(idCliente: number){
    this.deudaService.getUserDebt(idCliente)
    .subscribe({
      next: ( resp:any )=>{
        console.log('Deudas-->', resp);
        this.deudas = resp.deudas
      },
      error: error=>console.log(error),
      complete: ()=>{
        this.panel = true;
        console.log('Se obtubo la deuda correctamente');
      }
    });
  }


  cerrarPanel(){
    this.panel=false;
    this.deudas = [];
  }

}
