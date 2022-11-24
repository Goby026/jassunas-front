import { Component, OnInit } from '@angular/core';
import { RequisitoService } from 'src/app/services/requisito.service';
import { TupaService } from 'src/app/services/tupa.service';

@Component({
  selector: 'app-tributos',
  templateUrl: './tributos.component.html',
  styleUrls: ['./tributos.component.css']
})
export class TributosComponent implements OnInit {

  tupas: any[] = [];
  requisitos: any[] = [];
  reqSel: any[] = [];
  listaCobranza: any[] = [];

  constructor( private tupaService: TupaService, private requisitoService: RequisitoService ) { }

  ngOnInit(): void {
    this.listarTupas();
  }


  listarTupas(){
    this.tupaService.getAllTupas()
    .subscribe({
      next: ( resp:any )=> {
        this.tupas = resp.tupas;
      },
      error: error => console.log(error)
    });
  }

  seleccionTupa(idTupa: string){
    // TODO: llenar select de conceptos/requisitos
    if (idTupa !== '0') {
      this.requisitoService.getReqsByTupa(idTupa)
      .subscribe({
        next: ( resp:any )=> {
          this.requisitos = resp.requisitos;
        },
        error: error => console.log(error)
      });
    }else{
      this.requisitos = [];
      return;
    }
  }

  seleccionRequisito(req: string){
    this.requisitoService.getReqById(Number(req))
    .subscribe({
      next: ( resp:any )=> {
        this.reqSel.push(resp);
      },
      error: error => console.log(error)
    });
  }

}
