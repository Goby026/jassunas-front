import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Requisito } from 'src/app/models/requisito.model';
import { RequisitoService } from 'src/app/services/requisito.service';

@Component({
  selector: 'app-repote-bytupa',
  templateUrl: './repote-bytupa.component.html'
})
export class RepoteBytupaComponent implements OnInit {

  tupaForm!: FormGroup;
  requisitos: Requisito[] = [];

  constructor(private requisitosService: RequisitoService) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarRequisitos();
  }

  cargarRequisitos(){
    this.requisitosService.getAllRequisitos()
    .subscribe({
      next: (resp: Requisito[])=>this.requisitos = resp,
      error: error=>console.log(error)
    });
  }

  crearFormulario(){
    this.tupaForm = new FormGroup({
      tupa: new FormControl(null, Validators.required),
      tinicio: new FormControl(null,Validators.required),
      tfin: new FormControl(null,Validators.required),
    });
  }

  reportePagosPorTupa(){
    if (!this.tupaForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }
  }

}
