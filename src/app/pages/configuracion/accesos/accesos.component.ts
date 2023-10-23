import { Component, OnDestroy, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ingreso } from 'src/app/models/ingreso.model';
import { IngresoService } from 'src/app/services/ingreso.service';

@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html'
})
export class AccesosComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ingresos!: Ingreso[];

  constructor(
    private ingresosService: IngresoService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }
    this.cargarIngresos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true
    }
  }


  cargarIngresos(){
    this.ingresosService.getIngresos()
    .subscribe( {
      next: (resp : Ingreso[])=> this.ingresos = resp,
      error: (err:Error)=> console.log(err.message),
      complete: ()=>{
        this.dtTrigger.next(null);
      }
    } );
  }

}
