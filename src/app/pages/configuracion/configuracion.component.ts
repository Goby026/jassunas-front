import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {Subject} from 'rxjs';
import { Tarifario } from 'src/app/models/tarifario.model';
import { TarifasService } from 'src/app/services/tarifas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tarifas!: Tarifario[];
  idTarifa: number = 0;
  form: boolean = false;

  constructor( private tarifasService: TarifasService, private router: Router ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }
    this.listarTarifas();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  listarTarifas(): void {


    this.tarifasService.findAllTarifas()
    .subscribe({
      next: (res: Tarifario[])=> {
        this.tarifas = res;
      },
      error: (error)=> console.log(error),
      complete: ()=> {
        this.dtTrigger.next(null);
      }
    });
  }

  nuevo(): void{
    this.form = false;
    setTimeout( ()=> {
      this.idTarifa = 0;
      this.form = true;
    }, 200)
  }

  editar(id: any): void{
    this.form = false;
    setTimeout( ()=> {
      this.idTarifa = id;
      this.form = true;
    }, 200)
  }

  modificarEstado(event: HTMLInputElement, tarifa: Tarifario){

    if (!confirm('¿Cambiar estado?')) {
      if (event.checked) {
        event.checked = false;
      }else{
        event.checked = true;
      }
      return;
    }

    this.tarifasService.disableTarifa(tarifa)
    .subscribe({
      next: (resp)=>console.log(resp),
      error: (err)=>console.log(err),
      complete: ()=>console.log('Cambió estado de tarifa '+ tarifa.idtarifario)
    });

  }

  recargarTarifas(e:any){
    if(e){
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard/configuracion']);
    });
    }
  }

  closeForm(e:any){
    if(e){
      this.idTarifa = 0;
      this.form = false;
    }
  }

}
