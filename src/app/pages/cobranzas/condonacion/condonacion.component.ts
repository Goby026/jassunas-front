import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Condonacion } from 'src/app/models/condonacion.model';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { CondonacionService } from 'src/app/services/condonacion.service';

@Component({
  selector: 'app-condonacion',
  templateUrl: './condonacion.component.html',
  styleUrls: ['./condonacion.component.css']
})
export class CondonacionComponent implements OnInit {

  @Input() deudas: Deuda[] = [];
  @Input() monto: number = 0;

  condonacion!: Condonacion;
  condonacionForm!: FormGroup;

  deudasMod!: Deuda[];

  constructor( private deudaService: DeudaService, private condonacionService: CondonacionService ) { }

  ngOnInit(): void {
    this.crearFormularioCondonacion();
  }


  crearFormularioCondonacion(){

    this.condonacionForm = new FormGroup({
      // "monto": new FormControl(null, Validators.required),
      "observacion": new FormControl(null, Validators.required),
    });

  }

  registrarCondonacion(){
    if (this.condonacionForm.invalid) {
      return;
    }
    let itemCon: Condonacion;
    let listaCon:Condonacion[] = []; //array para enviar al back

    this.deudasMod = this.deudas.map( (item)=> {
      itemCon = {
        estado: 1,
        fecha: new Date(),
        monto: Number(item.total),
        observacion: this.condonacionForm.get('observacion')?.value,
        usuario: 'Tesorera',
        deuda: item
      }
      listaCon.push(itemCon);

      item.deudaEstado.iddeudaEstado = 1;

      return item;
    });

    this.condonacionService.saveCondonaciones(listaCon)
    .subscribe({
      next: ( resp:any )=>{
        this.actualizarEstadoDeuda(this.deudasMod);
      },
      error: error => console.log(error)
    });

    // EMITIR ORDEN PARA ACTUALIZAR LISTA DE DEUDAS
  }

  // actualizar estado de deuda (iddeuda_estado) a 1
  actualizarEstadoDeuda(deudas: Deuda[]){
    this.deudaService.updateUserDebts(deudas)
    .subscribe({
      next: ( resp:any )=>{
        console.log(resp);
      },
      error: error => console.log(error),
      // complete: ()=> this.cargarDeudasCliente(this.idCliente)
    });
  }

  cleanData(){
    this.deudas = [];
    this.monto = 0;
  }

}
