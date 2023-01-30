import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  title='Lista de clientes';
  cliente!: Cliente;
  clientes: Cliente[] = [];
  panel: boolean = false;
  clienteForm!: FormGroup;


  // PAGINADOR
  page: number = 1;
  count: number = 0;
  tableSize: number = 15;
  tableSizes: number[] = [5,10,15,20];


  constructor( private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.listarClientes();
    this.crearFormulario();
  }

  crearFormulario(): void{
    this.clienteForm = new FormGroup({
      'dni':new FormControl(null, Validators.required),
      'nombres':new FormControl(null, Validators.required),
      'apepaterno':new FormControl(null, Validators.required),
      'apematerno':new FormControl(null, Validators.required),
      'direccion':new FormControl(null, Validators.required),
      'fec_nac':new FormControl(null, Validators.required),
      'num_instalaciones':new FormControl(null, Validators.required),
      'num_familias':new FormControl(null, Validators.required),
      'exo_p':new FormControl(null, Validators.required),
      'exo_a':new FormControl(null, Validators.required),
      'exo_f':new FormControl(null, Validators.required),
      'fec_ing':new FormControl(null, Validators.required),
      'baja':new FormControl(null, Validators.required),
      'fec_baja':new FormControl(null, Validators.required),
      'tipoCliente':new FormControl(null, Validators.required),
      'zona':new FormControl(null, Validators.required),
      'estado':new FormControl(null, Validators.required)
    });
  }

  listarClientes(): void{
    this.clienteService.listClients()
    .subscribe({
      next: ( resp:any )=>{
        this.clientes = resp.clientes;
      },
      error: error=>console.log('ERROR->', error)
    });
  }

  recibiendoClientes(event: any): void {
    this.clientes = event.clientes;
  }


  onTableDataChange( event: any ): void{
    this.page = event;
    this.listarClientes();
  }

  onTableSizeChange(event: any):void{
    this.tableSize = event.target.value;
    this.page = 1;
    this.listarClientes();
  }


  editarCliente(dataCliente: Cliente): void{
    this.panel = true;
    this.cliente = dataCliente;

    // setear formulario
    this.clienteForm.setValue({
      'dni': this.cliente.dni,
      'nombres': this.cliente.nombres,
      'apepaterno':this.cliente.apepaterno,
      'apematerno':this.cliente.apematerno,
      'direccion':this.cliente.direccion,
      'fec_nac':this.cliente.fec_nac,
      'num_instalaciones':this.cliente.num_instalaciones,
      'num_familias':this.cliente.num_familias,
      'exo_p':this.cliente.exo_p,
      'exo_a':this.cliente.exo_a,
      'exo_f':this.cliente.exo_f,
      'fec_ing':this.cliente.fec_ing,
      'baja':this.cliente.baja,
      'fec_baja':this.cliente.fec_baja,
      'tipoCliente':this.cliente.tipoCliente.descripcion,
      'zona':this.cliente.zona.detazona,
      'estado':this.cliente.estado,
    })
  }

  actualizar(){
    console.log(this.clienteForm.value);
  }

  mantenimiento(){
    alert('Funcionalidad en mantenimiento');
    return;
  }

}
