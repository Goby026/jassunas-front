import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Deuda } from 'src/app/models/deuda.model';

@Component({
  selector: 'app-repote-bycliente',
  templateUrl: './repote-bycliente.component.html'
})
export class RepoteByclienteComponent implements OnInit {

  clienteForm!: FormGroup;

  deudas: Deuda[] = [];

  constructor() { }

  ngOnInit(): void {
    this.crearFormulario()
  }

  crearFormulario(){
    this.clienteForm = new FormGroup({
      cinicio: new FormControl(null, Validators.required),
      cfin: new FormControl(null, Validators.required)
    });
  }

  reporteDeudasCliente(){
    if (!this.clienteForm.valid){
      alert('Indique parámetros de busqueda correctamente');
      return;
    }
  }

}
