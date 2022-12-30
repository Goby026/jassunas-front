import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoService } from 'src/app/services/costo.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { ZonaService } from 'src/app/services/zona.service';

import * as moment from 'moment';
import { Costo } from 'src/app/models/costo.model';
import { Servicio } from 'src/app/models/servicio.model';
import { Zona } from 'src/app/models/zona.model';
import { TipoCliente } from 'src/app/models/tipoCliente.model';

@Component({
  selector: 'app-cliente-data',
  templateUrl: './cliente-data.component.html',
  styleUrls: ['./cliente-data.component.css']
})
export class ClienteDataComponent implements OnInit {

  servicios: Servicio[] = [];
  zonas: Zona[] = [];
  tipoClientes: TipoCliente[] = [];

  cliente!: Cliente;
  costo!: Costo;

  clienteForm!: FormGroup;
  costoForm!: FormGroup;

  estadoCliente:boolean = false;
  submitted = false;


  constructor(
    private clienteService: ClienteService,
    private costoService: CostoService,
    private servicioService: ServicioService,
    private zonaService: ZonaService ) { }

  ngOnInit(): void {
    this.listarServicios();
    this.listarZonas();
    this.listarTipoClientes();
    this.crearFormularioCliente();
    this.crearFormularioCosto()
  }

  crearFormularioCliente(){
    this.clienteForm = new FormGroup({
      'dni': new FormControl(null, Validators.required),
      'nombres': new FormControl(null, Validators.required),
      'apepaterno': new FormControl(null, Validators.required),
      'apematerno': new FormControl(null, Validators.required),
      'direccion': new FormControl(null, Validators.required),
      'fec_nac': new FormControl(),
      'num_instalaciones': new FormControl(1, Validators.required),
      'num_familias': new FormControl(1, Validators.required),
      'exo_p': new FormControl(false),
      'exo_a': new FormControl(false),
      'exo_f': new FormControl(false),
      'fec_ing': new FormControl(moment().format('YYYY-MM-DD')),
      'baja': new FormControl(1),
      'fec_baja': new FormControl(moment().format('YYYY-MM-DD')),
      'idtipocliente': new FormControl(),
      'idtbzonas': new FormControl(),
      'estado': new FormControl(1)
    });
  }

  crearFormularioCosto(){
    this.costoForm = new FormGroup({
      'servicio':new FormControl(0, Validators.required),
      'nrointegrante': new FormControl(null, Validators.required),
      'fcobranza': new FormControl(moment().format('YYYY-MM-DD')),
      'referencia_dom': new FormControl(null, Validators.required),
      'mza': new FormControl(null),
      'lote': new FormControl(null),
      'nropre': new FormControl(null),
      'fecha_inicio_servicio': new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
      'esta': new FormControl(null, Validators.required),
    });
  }

  listarServicios(){
    this.servicioService.listServicios()
    .subscribe({
      next: (resp:any) => this.servicios = resp.servicios,
      error: error => console.log(error)
    });
  }

  listarZonas(){
    this.zonaService.listAllZonas()
    .subscribe({
      next: (resp:any) => this.zonas = resp.zonas,
      error: error => console.log(error)
    });
  }

  listarTipoClientes(){
    this.clienteService.getTipoClientes()
    .subscribe({
      next: (resp:any) => this.tipoClientes = resp.tipoClientes,
      error: error => console.log(error)
    });
  }

  registrarCliente(){

    this.submitted = true;

    if (this.clienteForm.invalid && this.costoForm.invalid) {
      return;
    }

    console.log(JSON.stringify(this.clienteForm.value, null, 2));

    this.cliente = {
      dni: String(this.clienteForm.get('dni')?.value),
      num_instalaciones: this.clienteForm.get('num_instalaciones')?.value,
      nombres: this.clienteForm.get('nombres')?.value,
      apepaterno: this.clienteForm.get('apepaterno')?.value,
      apematerno: this.clienteForm.get('apematerno')?.value,
      direccion: this.clienteForm.get('direccion')?.value,
      num_familias: this.clienteForm.get('num_familias')?.value,
      exo_p: this.clienteForm.get('exo_p')?.value,
      exo_a: this.clienteForm.get('exo_a')?.value,
      exo_f: this.clienteForm.get('exo_f')?.value,
      fec_nac: this.clienteForm.get('fec_nac')?.value,
      fec_ing: this.clienteForm.get('fec_ing')?.value,
      baja: this.clienteForm.get('baja')?.value,
      fec_baja: this.clienteForm.get('fec_baja')?.value,
      tipoCliente: {
        idtipocliente: this.clienteForm.get('idtipocliente')?.value,
        descripcion: ''
      },
      zona: {
        idtbzonas: this.clienteForm.get('idtbzonas')?.value,
        detazona: ''
      },
      estado: '1'
    }

    // REGISTRAR CLIENTE
    this.clienteService.saveClient(this.cliente)
    .subscribe({
      next: (resp: any)=>{
        this.cliente.idclientes = resp.idclientes;
        this.registrarCosto(this.cliente);
      },
      error: error => console.log(error),
      complete: ()=> this.clienteForm.reset
    });

  }

  registrarCosto(cli: Cliente){
    this.costo = {
      servicio:{
        codservi: this.costoForm.get('servicio')?.value,
        detaservicios: '',
        estado:1
      },
      zona:{
        detazona: '',
        idtbzonas: cli.zona.idtbzonas
      },
      cliente: cli,
      mza:this.costoForm.get('mza')?.value,
      lote:this.costoForm.get('lote')?.value,
      nropre:this.costoForm.get('nropre')?.value,
      fecha_registro:new Date(),
      fecha_inicio_servicio:this.costoForm.get('fecha_inicio_servicio')?.value,
      fcobranza:this.costoForm.get('fcobranza')?.value,
      esta:1,
      suministro:'null',
      kw:'null',
      exof:cli.exo_f,
      exoa:cli.exo_a,
      exop:cli.exo_p,
      tpousuario: cli.tipoCliente.descripcion,
      tpovivienda:'UNIFAMILIAR',
      nrointegrante: Number(this.costoForm.get('nrointegrante')?.value),
      referencia_dom:this.costoForm.get('referencia_dom')?.value,
    }

    this.costoService.saveCost(this.costo)
    .subscribe({
      next: (resp: any)=> console.log(resp),
      error: error => console.log(error)
    });
  }


  changeEstadoCliente(opc: string){
    if (Number(opc) !== 1) {
      this.estadoCliente = true;
    }else{
      this.estadoCliente = false;
    }
  }


  get f(): { [key: string]: AbstractControl } {
    return this.clienteForm.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.clienteForm.reset();
  }

}