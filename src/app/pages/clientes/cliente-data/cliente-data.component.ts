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
import { Router } from '@angular/router';
import { Tarifario } from 'src/app/models/tarifario.model';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';

@Component({
  selector: 'app-cliente-data',
  templateUrl: './cliente-data.component.html'
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
    private zonaService: ZonaService,
    private costoOtroService: CostoOtrosService,
    private router: Router ) { }

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
      'tipoCliente': new FormControl(),
      'zona': new FormControl(),
      'estado': new FormControl(1),
      'codCli': new FormControl(0, Validators.required)
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
      next: (resp:any) => this.servicios = resp,
      error: error => console.log(error)
    });
  }

  listarZonas(){
    this.zonaService.listAllZonas()
    .subscribe({
      next: (resp:any) => this.zonas = resp,
      error: error => console.log(error)
    });
  }

  listarTipoClientes(){
    this.clienteService.getTipoClientes()
    .subscribe({
      next: (resp:any) => this.tipoClientes = resp,
      error: error => console.log(error)
    });
  }

  getTipoCliente(idtipoCli: number): TipoCliente{
    let tipoCli: TipoCliente[] = this.tipoClientes.filter( (tipo)=> {
      return tipo.idtipocliente === idtipoCli;
    });
    return tipoCli[0];
  }

  getZona(idzona: number): Zona{
    let zona_: Zona[] = this.zonas.filter( (z)=> {
      return z.idtbzonas === idzona;
    });
    return zona_[0];
  }

  registrarCliente(){
    this.submitted = true;
    if (this.clienteForm.invalid && this.costoForm.invalid) {
      return;
    }

    if (!confirm('¿Registrar cliente nuevo?')) {
      return;
    }

    let tipoCli: TipoCliente = this.getTipoCliente(Number(this.clienteForm.get('tipoCliente')?.value));

    let zzona: Zona = this.getZona( Number(this.clienteForm.get('zona')?.value) );

    // console.log(JSON.stringify(this.clienteForm.value, null, 2));
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
      tipoCliente: tipoCli,
      zona: zzona,
      estado: '1',
      codCli: this.clienteForm.get('codCli')?.value,
    }

    // REGISTRAR CLIENTE
    this.clienteService.saveClient(this.cliente)
    .subscribe({
      next: (resp: Cliente)=>{
        // this.cliente.idclientes = resp.idclientes;
        this.cliente = resp;
      },
      error: error => console.log(error),
      complete: ()=> {
        this.clienteForm.reset();
        this.registrarCosto(this.cliente);
        alert('Cliente registrado correctamente');
        this.router.navigate(['/dashboard/clientes']);
      }
    });

  }

  registrarCosto(cli: Cliente){
    this.costo = {
      servicio:{
        codservi: this.costoForm.get('servicio')?.value,
        detaservicios: '',
        estado:1
      },
      zona:cli.zona,
      cliente: cli,
      mza:this.costoForm.get('mza')?.value,
      lote:this.costoForm.get('lote')?.value,
      nropre:this.costoForm.get('nropre')?.value,
      fecha_registro: moment().toDate(),
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
      next: (resp: Costo)=> {
        this.costo = resp;
        this.registrarTarifa(resp);
      },
      error: error => console.log(error)
    });
  }

  // table: tbcostootroservicio
  registrarTarifa(ccosto: Costo): void {

    // setear tarifario
    let tarifa: Tarifario = {
      idtarifario: 2,
      detalletarifario: null,
      esta: null,
      monto: null,
      servicio: ccosto.servicio,
    }

    let costoOtro: CostoOtroServicio = {
      costo: ccosto,
      tarifario: tarifa
    }

    this.costoOtroService.saveCostoOtroServicio(costoOtro)
    .subscribe({
      next:(resp:CostoOtroServicio)=>{
        // console.log(resp);
      },
      error:(error)=> console.error(error),
      complete:()=> console.info('Tarifa registrada')
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
