import { Component, OnInit } from '@angular/core';
import { OcurrenciaService } from 'src/app/services/ocurrencia.service';

@Component({
  selector: 'app-ocurrencias',
  templateUrl: './ocurrencias.component.html',
  styleUrls: ['./ocurrencias.component.css']
})
export class OcurrenciasComponent implements OnInit {

  ocurrencias: any[] = [];
  panelObservacion: boolean = false;

  constructor( private ocurreciaService: OcurrenciaService ) { }

  ngOnInit(): void {
    this.listarOcurrencias();
  }

  listarOcurrencias(){
    this.ocurreciaService.getOcurrencias()
    .subscribe( {
      next: ( resp:any )=>{
        this.ocurrencias = resp.ocurrencias;
      },
      error: error=>console.log(error)
    } );
  }

  setObservacion(){
    this.panelObservacion = true;
  }

}
