import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Deuda } from 'src/app/models/deuda.model';
import { Zona } from 'src/app/models/zona.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { ZonaService } from 'src/app/services/zona.service';

@Component({
  selector: 'app-repote-byzona',
  templateUrl: './repote-byzona.component.html'
})
export class RepoteByzonaComponent implements OnInit {

  zonaForm!: FormGroup;
  deudas: Deuda[] = [];
  zonas: Zona[] = [];

  constructor(private deudaService: DeudaService, private zonasService: ZonaService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarZonas();
  }

  cargarZonas(){
    this.zonasService.listAllZonas()
    .subscribe({
      next: (resp: Zona[])=>this.zonas = resp,
      error: error=>console.log(error),
      // complete: ()=>
    });
  }

  crearFormulario(){
    this.zonaForm = new FormGroup({
      zona: new FormControl(null, Validators.required),
      anio: new FormControl(null,Validators.required),
    });
  }

  reporteDeudasZonaAnio(){
    if (!this.zonaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }

    this.deudaService.geDebtsByZoneAndYear(this.zonaForm.get('zona')?.value, this.zonaForm.get('anio')?.value)
    .subscribe({
      next: (resp: Deuda[])=>this.deudas = resp,
      error: error=>console.log(error),
      // complete: ()=> console.log('completo')
    });

  }

}
