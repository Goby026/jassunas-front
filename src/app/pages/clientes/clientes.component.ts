import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { TipoCliente } from 'src/app/models/tipoCliente.model';
import { Zona } from 'src/app/models/zona.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { ZonaService } from 'src/app/services/zona.service';

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

  tipoClientes!: TipoCliente[];
  zonas!: Zona[];


  // PAGINADOR
  page: number = 1;
  count: number = 0;
  tableSize: number = 15;
  tableSizes: number[] = [5,10,15,20];


  constructor(
    private clienteService: ClienteService,
    private zonaService: ZonaService,
    private tipoClienteService: ClienteService
    ) { }

  ngOnInit(): void {
    this.listarClientes();
    this.crearFormulario();
    this.listarTipoClientes();
    this.listarZonas();
  }

  crearFormulario(): void{
    this.clienteForm = new FormGroup({
      'dni':new FormControl(null, Validators.required),
      'nombres':new FormControl(null, Validators.required),
      'apepaterno':new FormControl(null, Validators.required),
      'apematerno':new FormControl(null, Validators.required),
      'direccion':new FormControl(null, Validators.required),
      'fec_nac':new FormControl(null),
      'num_instalaciones':new FormControl(null, Validators.required),
      'num_familias':new FormControl(null, Validators.required),
      'exo_p':new FormControl(null),
      'exo_a':new FormControl(null),
      'exo_f':new FormControl(null),
      'fec_ing':new FormControl(null),
      'baja':new FormControl(null),
      'fec_baja':new FormControl(null),
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

  listarTipoClientes():void{

    this.tipoClienteService.getTipoClientes()
    .subscribe({
      next: (resp: any)=>{
        this.tipoClientes = resp.tipoClientes;
      },
      error: (error)=>console.log(error)
    });

  }

  listarZonas():void{

    this.zonaService.listAllZonas()
    .subscribe({
      next: (resp: Zona[])=>{
        this.zonas = resp;
      },
      error: (error)=>console.log(error)
    });

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
      'tipoCliente':this.cliente.tipoCliente.idtipocliente,
      'zona':this.cliente.zona.idtbzonas,
      'estado':this.cliente.estado,
    })
  }

  actualizar(){

    if(!this.clienteForm.valid){
      alert('Indique correctamente los campos del formulario');
      return;
    }

    if (!confirm('¿Actualizar cliente?')) {
      return;
    }

    let z: Zona[] = this.zonas.filter( (item) => item.idtbzonas === Number(this.clienteForm.get('zona')?.value) );

    let tipoCli: TipoCliente[] = this.tipoClientes.filter( (item)=>item.idtipocliente === Number(this.clienteForm.get('tipoCliente')?.value) );

    let clienteUpdate : Cliente = {
      idclientes: this.cliente.idclientes,
      dni: this.clienteForm.get('dni')?.value,
      nombres: this.clienteForm.get('nombres')?.value,
      apepaterno: this.clienteForm.get('apepaterno')?.value,
      apematerno: this.clienteForm.get('apematerno')?.value,
      direccion: this.clienteForm.get('direccion')?.value,
      fec_nac: this.clienteForm.get('fec_nac')?.value,
      num_instalaciones: this.clienteForm.get('num_instalaciones')?.value,
      num_familias: this.clienteForm.get('num_familias')?.value,
      exo_p: this.clienteForm.get('exo_p')?.value,
      exo_a: this.clienteForm.get('exo_a')?.value,
      exo_f: this.clienteForm.get('exo_f')?.value,
      fec_ing: this.clienteForm.get('fec_ing')?.value,
      baja: this.clienteForm.get('baja')?.value,
      fec_baja: this.clienteForm.get('fec_baja')?.value,
      tipoCliente: tipoCli[0],
      zona: z[0],
      estado: this.clienteForm.get('estado')?.value,
    }

    this.clienteService.updateClient(clienteUpdate)
    .subscribe({
      next: (resp: Cliente)=>{
        console.log(resp);
      },
      error: (error)=> console.error(error),
      complete:()=>this.listarClientes()
    });
  }

  mantenimiento(){
    alert('Funcionalidad en mantenimiento');
    return;
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

}
