import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TipoEgreso } from 'src/app/models/tipoegreso.model';
import { TipoegresoService } from 'src/app/services/tipoegreso.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cate-egresos',
  templateUrl: './cate-egresos.component.html',
})
export class CateEgresosComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tipoEgresos!: TipoEgreso[];
  idTipoEgreso: number = 0;
  form: boolean = false;

  constructor(
    private tipoEgresoService: TipoegresoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: environment.language
    }
    this.listarTiposEgresos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  listarTiposEgresos(): void {
    this.tipoEgresoService.getAll().subscribe({
      next: (res: TipoEgreso[]) => (this.tipoEgresos = res),
      error: (err) => console.log(err),
      complete: () => {
        this.dtTrigger.next(null);
      },
    });
  }

  recargarCategorias(e: any): void {
    if (e) {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['/dashboard/configuracion/cate-egresos']);
        });
    }
  }

  modificarEstado(event: HTMLInputElement, tipo: TipoEgreso) {
    if (!confirm('¿Cambiar estado?')) {
      if (event.checked) {
        event.checked = false;
      } else {
        event.checked = true;
      }
      return;
    }

    // this.tarifasService.disableTarifa(tarifa)
    // .subscribe({
    //   next: (resp)=>console.log(resp),
    //   error: (err)=>console.log(err),
    //   complete: ()=>console.log('Cambió estado de tarifa '+ tarifa.idtarifario)
    // });
  }

  nuevo(): void {
    this.form = false;
    setTimeout(() => {
      this.idTipoEgreso = 0;
      this.form = true;
    }, 200);
  }

  editar(id: any): void {
    this.form = false;
    setTimeout(() => {
      this.idTipoEgreso = id;
      this.form = true;
    }, 200);
  }

  closeForm(e: any) {
    if (e) {
      this.idTipoEgreso = 0;
      this.form = false;
    }
  }
}
