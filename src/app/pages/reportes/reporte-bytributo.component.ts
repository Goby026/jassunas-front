import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Requisito } from 'src/app/models/requisito.model';
import { TributoDetalle } from 'src/app/models/tributoDetalle.model';
import { RequisitoService } from 'src/app/services/requisito.service';
import { TributoService } from 'src/app/services/tributo.service';
import { ByTributoDatesReport } from '../reports/ByTributoDatesReport';
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-bytributo',
  templateUrl: './reporte-bytributo.component.html',
  styles: [
  ]
})
export class ReporteBytributoComponent implements OnInit {

  requisitoForm!: FormGroup;
  detalles!: TributoDetalle[];
  requisitos!: Requisito[];
  req!: Requisito[];

  constructor(
    private tributoService: TributoService,
    private requisitoService: RequisitoService
     ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarRequisitos();
  }

  crearFormulario(){
    this.requisitoForm = new FormGroup({
      'tributo': new FormControl(null, Validators.required),
      'inicio': new FormControl(null, Validators.required),
      'fin': new FormControl(null, Validators.required),
    });
  }

  listarRequisitos(){
    this.requisitoService.getAllRequisitos()
    .subscribe({
      next: (resp)=> this.requisitos = resp,
      error: (err)=> console.log(err)
    });
  }

  listarPagosTributos(){
    if(!this.requisitoForm.valid){
      alert('Indique correctamente los parámetros');
      return;
    }

    let f_inicial: string = moment(this.requisitoForm.get('inicio')?.value).format('yyyy-MM-DD');
    let f_final: string = moment(this.requisitoForm.get('fin')?.value).add(1, 'days').format('yyyy-MM-DD');

    this.tributoService.getDetallesTributoDates(
      Number(this.requisitoForm.get('tributo')?.value),
      f_inicial,
      f_final,
    )
    .subscribe({
      next: (resp)=> {
        this.detalles = resp
      },
      error: (err)=> console.log(err),
      complete: ()=> {
        this.req = this.requisitos.filter( (item)=>{
          return item.codrequi === Number(this.requisitoForm.get('tributo')?.value);
        } );
      }
    });
  }


  crearPdf(){

    if(!this.requisitoForm.valid){
      alert('Indique correctamente los parámetros');
      return;
    }

    let f_inicial: string = moment(this.requisitoForm.get('inicio')?.value).format('yyyy-MM-DD');
    let f_final: string = moment(this.requisitoForm.get('fin')?.value).format('yyyy-MM-DD');

    let reporte: ByTributoDatesReport = new ByTributoDatesReport(
      `REPORTE DE PAGOS POR: [${this.req[0].requisitos}]`,
      f_inicial,
      f_final,
      this.detalles
    );

    reporte.reporte();
  }

}
