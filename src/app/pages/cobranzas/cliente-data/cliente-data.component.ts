import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';

@Component({
  selector: 'app-cliente-data',
  templateUrl: './cliente-data.component.html',
  styleUrls: ['./cliente-data.component.css']
})
export class ClienteDataComponent implements OnInit {

  @Input() idCliente:number=0;
  @Output() featureSelected = new EventEmitter<string>();
  @Output() codCosto = new EventEmitter<number>();

  cliente: any = {};
  idCosto: number = 0;

  constructor( private clienteService: ClienteService, private costoService: CostoService ) { }

  ngOnInit(): void {
    console.log(this.idCliente);
    this.mostrarCliente();
    this.obtenerCostoPorCliente(this.idCliente);
  }

  mostrarCliente(){
    this.clienteService.getClientById(this.idCliente)
    .subscribe({
      next: ( resp:any )=>{
        this.cliente = resp;
      },
      error: error=>console.log(error)
    });
  }

  onSelect(feature: string){
    //TODO: verificar si hay pagospreconfigurados del cliente
    this.featureSelected.emit(feature);
    this.codCosto.emit(this.idCosto);
  }

  obtenerCostoPorCliente(idCliente: number){
    this.costoService.getCostsByClient(idCliente)
    .subscribe({
      next: ( resp:any )=>{
        this.idCosto = resp.costos[0].codcosto;
      },
      error: error=>console.log(error),
      complete: ()=> console.log('COD-COSTO----->', this.idCosto)
    });
  }

}
