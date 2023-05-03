import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Caja } from 'src/app/models/caja.model';
import { Egreso } from 'src/app/models/egreso.model';
import { TipoEgreso } from 'src/app/models/tipoegreso.model';
import { Usuario } from 'src/app/models/usuario.model';
import { CajaService } from 'src/app/services/caja.service';
import { EgresoService } from 'src/app/services/egreso.service';
import { TipoegresoService } from 'src/app/services/tipoegreso.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
})
export class EgresosComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  form: boolean = false;
  tablaEgresos: boolean = true;

  caja!: Caja;
  usuario!: Usuario;
  egresos!: Egreso[];
  tiposEgresos!: TipoEgreso[];

  idegreso: number = 0;

  constructor(
    private cajaService: CajaService,
    private egresoService: EgresoService,
    private tipoEgresoService: TipoegresoService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }
    this.verificarEstadoCaja();
    this.listar();
    this.listarTiposEgreso();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtOptions = {
      destroy: true
    }
  }

  verificarEstadoCaja() {
    this.cajaService.getCajaStatus().subscribe({
      next: (resp: Caja) => {
        if (resp) {
          if (resp.esta !== 1) {
            alert('Caja no esta aperturada');
            this.router.navigate(['/dashboard/caja']);
          } else {
            this.caja = resp;
          }
        } else {
          alert('No hay resultado de cobranzas');
        }
      },
      error: (error) => console.log(error),
      complete: () => {
        this.usuario = this.usuarioService.getLocalUser();
      },
    });
  }

  // LISTAR
  listar(): void {
    this.egresoService.getAll().subscribe({
      next: (resp: Egreso[]) => (this.egresos = resp),
      error: (err) => console.log(err),
      complete: ()=> this.dtTrigger.next(null)
    });
  }

  //LISTAR TIPOS DE EGRESO
  listarTiposEgreso(): void {
    this.tipoEgresoService.getAll()
    .subscribe({
      next: (resp: TipoEgreso[]) => (this.tiposEgresos = resp),
      error: (err) => console.log(err)
    });
  }

  nuevo(): void{
    this.form = false;
    setTimeout( ()=> {
      this.idegreso = 0;
      this.form = true;
    }, 200)
  }

  editar(id: any): void{
    this.form = false;
    setTimeout( ()=> {
      this.idegreso = id;
      this.form = true;
    }, 200)
  }

  // modificarEstado(event: HTMLInputElement, tarifa: Tarifario){

  //   if (!confirm('¿Cambiar estado?')) {
  //     if (event.checked) {
  //       event.checked = false;
  //     }else{
  //       event.checked = true;
  //     }
  //     return;
  //   }

  //   this.tarifasService.disableTarifa(tarifa)
  //   .subscribe({
  //     next: (resp)=>console.log(resp),
  //     error: (err)=>console.log(err),
  //     complete: ()=>console.log('Cambió estado de tarifa '+ tarifa.idtarifario)
  //   });

  // }

  // filtrarCategoria(categoria: HTMLSelectElement): void{
  //   // console.log(categoria.value);
  //   if(categoria.value !== 'all'){
  //     this.egresos= this.egresos.filter( (item)=>{
  //       return item.tipoEgreso.idtipoegreso === Number(categoria.value)
  //     });
  //   }else{
  //     // mostrar todos los registros
  //   }
  // }

  recargarEgresos(e:any){
    if(e){
      this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/dashboard/egresos']);
    });
    }
  }

  closeForm(e:any){
    if(e){
      this.idegreso = 0;
      this.form = false;
    }
  }

}
