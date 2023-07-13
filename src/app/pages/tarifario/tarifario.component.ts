import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Costo } from 'src/app/models/costo.model';
import { CostoOtroServicio } from 'src/app/models/costootroservicio.model';
import { Tarifario } from 'src/app/models/tarifario.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoService } from 'src/app/services/costo.service';
// import { ServicioService } from 'src/app/services/servicio.service';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-tarifario',
  templateUrl: './tarifario.component.html',
})
export class TarifarioComponent implements OnInit {

  // @Input() idCosto: number = 0;

  idTarifaSelected: number = 0;
  idCliente: number = 0;

  cliente!: Cliente;
  costos!: Costo[];
  costoOtros!: CostoOtroServicio[];
  newCostoOtro!: CostoOtroServicio;
  tarifas!: Tarifario[];
  tarifaSelected!: Tarifario[];

  nombres: string = "";
  nombreServicio: string = "";

  // servicios: any[] = [];

  panelTarifas: boolean = false;

  constructor(
    private tarifaService: TarifasService,
    private clienteService: ClienteService,
    // private servicioService: ServicioService,
    private costoService: CostoService,
    private costoOtroService: CostoOtrosService,
    private activatedRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this.setParametros();
    this.listarTarifas();
  }

  setParametros() {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        // const arregloSerializado = params['arrDeudas'];
        this.idCliente = params['idClientes'];
        console.log(this.idCliente);

        this.obtenerClientePorId(this.idCliente);

      },
      error: (error) => console.log(error),
      complete: () => {
        console.log('Cliente obtenido correctamente');
      },
    });
  }

  listarTarifas(){

    this.tarifaService.findAllTarifas()
    .subscribe({
      next: (resp:Tarifario[])=>{
        this.tarifas = resp;
      },
      error: error=>console.log(error)
    });

  }

  obtenerClientePorId(id: number){
    this.clienteService.getClientById(id)
    .subscribe({
      next: (cli:Cliente)=>{
        this.cliente = cli;
        this.nombres = `${cli.nombres} ${cli.apepaterno} ${cli.apematerno}`;
      },
      error: error=>console.log(error),
      complete: ()=> {
        this.obtenerCostoPorIdCliente(this.cliente.idclientes);
      }
    });
  }

  obtenerCostoPorIdCliente(idCliente: any){
    this.costoService.getCostsByClient(idCliente)
    .subscribe({
      next: (resp:any)=>{
        this.costos = resp;
      },
      error: error=>console.log(error)
    });
  }

  obtenerIdCostoOtro(codCosto: any, nomServ: any){
    this.panelTarifas = true;
    this.nombreServicio = nomServ;
    this.costoOtroService.getCosto_otros(Number(codCosto))
    .subscribe({
      next: ( resp:CostoOtroServicio[] )=>{
        this.costoOtros = resp;
      },
      error: error => console.log(error)
    });
  }

  setCostoOtroServicio( costoOtro: CostoOtroServicio ): void{
    this.newCostoOtro = costoOtro;
  }

  setTarifa(idTarifa: HTMLSelectElement){
    this.tarifaSelected = this.tarifas.filter( (item)=> item.idtarifario === Number(idTarifa.value));

    this.newCostoOtro.tarifario = this.tarifaSelected[0];
  }


  actualizarTarifa(): void{

    console.log('COSTO PARA MODIFICAR', this.newCostoOtro);

    this.costoOtroService.updateCostoOtroServicio(this.newCostoOtro)
    .subscribe({
      next: ( resp:CostoOtroServicio )=>{
        if (resp.id! > 0) {
          alert('Tarifa actualizada correctamente');
        }
      },
      error: error => console.log(error),
      complete: ()=> {
        // RELOAD COSTOS
        this.obtenerIdCostoOtro(this.newCostoOtro.id, this.newCostoOtro.tarifario.detalletarifario)
      }
    });

  }



}
