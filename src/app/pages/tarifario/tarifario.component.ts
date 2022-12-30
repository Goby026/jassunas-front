import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.model';
import { Costo } from 'src/app/models/costo.model';
import { Tarifario } from 'src/app/models/tarifario.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { CostoService } from 'src/app/services/costo.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-tarifario',
  templateUrl: './tarifario.component.html',
  styleUrls: ['./tarifario.component.css']
})
export class TarifarioComponent implements OnInit {

  // @Input() idCosto: number = 0;

  idTarifaSelected: number = 0;

  cliente!: Cliente;
  costos!: Costo[];
  tarifas!: any[];

  nombres: string = "";
  nombreServicio: string = "";

  servicios: any[] = [];

  panelTarifas: boolean = false;

  constructor(
    private tarifaService: TarifasService,
    private clienteService: ClienteService,
    private servicioService: ServicioService,
    private costoService: CostoService,
    private costoOtroService: CostoOtrosService,
    private activatedRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this.obtenerClientePorId( this.activatedRoute.snapshot.params["idClientes"] );
  }

  // listarTarifas(idServicio: any){

  //   this.getIdCostoOtro(this.idCosto);

  //   this.tarifaService.findTarifasByIdService(idServicio)
  //   .subscribe({
  //     next: (resp:any)=>{
  //       this.tarifas = resp.tarifas;
  //     },
  //     error: error=>console.log(error)
  //   });

  // }

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
        this.costos = resp.costos;
      },
      error: error=>console.log(error)
    });
  }

  obtenerIdCostoOtro(codCosto: any, nomServ: any){
    this.panelTarifas = true;
    this.nombreServicio = nomServ;
    this.costoOtroService.getCosto_otros(Number(codCosto))
    .subscribe({
      next: ( resp:any )=>{
        // this.idTarifaSelected = resp.costootros[0].tarifario.idtarifario;
        this.tarifas = resp.costootros;
      },
      error: error => console.log(error)
    });
  }

  // listarServicios(){
  //   this.servicioService.listServicios()
  //   .subscribe({
  //     next: (resp:any)=>{
  //       this.servicios = resp.servicios;
  //     },
  //     error: error=>console.log(error)
  //   });
  // }



}
