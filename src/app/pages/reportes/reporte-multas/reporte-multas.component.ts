import { Component, OnInit } from '@angular/core';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaDescripcion } from 'src/app/models/deudadescripcion.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { MultasReport } from '../../reports/MultasReport';

@Component({
  selector: 'app-reporte-multas',
  templateUrl: './reporte-multas.component.html'
})
export class ReporteMultasComponent implements OnInit {

  tipoMultas!: DeudaDescripcion[];

  multas!: Deuda[];

  constructor(
    private deudasService: DeudaService
  ) { }

  ngOnInit(): void {
    this.cargarTipoMultas();
  }


  /*  CARGAR TIPO DE MULTAS (deudas) */
  cargarTipoMultas(){

    this.deudasService.getAllDeudaDescripcion()
    .subscribe({
      next: (resp: DeudaDescripcion[])=>{
        this.tipoMultas = resp.filter( (item)=>{
          return (item.iddeudadescripcion == 3 ||
            item.iddeudadescripcion == 4 ||
            item.iddeudadescripcion == 5)
        } );
      },
      error: err=>console.log(err),
      complete: ()=>{},
    });

  }

  /*  CARGAR TODAS LAS MULTAS (deudas) */
  cargarMultas(opc: HTMLSelectElement){
    if(Number(opc.value) == 0){
      this.multas = [];
      return;
    }

    this.deudasService.getAllDebts()
    .subscribe({
      next: ( multas: Deuda[] )=> {
        this.multas = multas.filter((item)=> {
          return (item.deudaDescripcion.iddeudadescripcion === Number(opc.value))
        });
      },
      error: err=> console.log(err)
    });

  }

  crearPDF(){
    //TODO: crear reporte de las multas seleccionadas
    if(this.multas.length <= 0){
      alert('Seleccionar tipo de multa');
      return;
    }

    let multaspdf: MultasReport = new MultasReport(this.multas);

    multaspdf.reporte()
  }

}
