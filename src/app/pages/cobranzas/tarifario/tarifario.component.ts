import { Component, Input, OnInit } from '@angular/core';
import { CostoOtrosService } from 'src/app/services/costo-otros.service';
import { ServicioService } from 'src/app/services/servicio.service';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-tarifario',
  templateUrl: './tarifario.component.html',
  styleUrls: ['./tarifario.component.css']
})
export class TarifarioComponent implements OnInit {

  @Input() idCosto: number = 0;

  idTarifaSelected: number = 0;

  tarifas: any[] = [];
  servicios: any[] = [];

  constructor( private tarifaService: TarifasService, private servicioService: ServicioService, private costoOtro: CostoOtrosService ) { }

  ngOnInit(): void {
    this.listarServicios();
  }

  listarTarifas(idServicio: any){

    this.getIdCostoOtro(this.idCosto);

    this.tarifaService.findTarifasByIdService(idServicio)
    .subscribe({
      next: (resp:any)=>{
        this.tarifas = resp.tarifas;
      },
      error: error=>console.log(error)
    });

  }

  listarServicios(){
    this.servicioService.listServicios()
    .subscribe({
      next: (resp:any)=>{
        this.servicios = resp.servicios;
      },
      error: error=>console.log(error)
    });
  }

  getIdCostoOtro(idCosto: number){
    this.costoOtro.getCosto_otros(idCosto)
    .subscribe({
      next: ( resp:any )=>{
        this.idTarifaSelected = resp.costootros[0].tarifario.idtarifario;
      },
      error: error => console.log(error)
    });
  }

}
