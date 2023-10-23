import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';

@Component({
  selector: 'app-cuentas-cobrar3',
  templateUrl: './cuentas-cobrar3.component.html',
  styleUrls: ['./cuentas-cobrar3.component.css']
})
export class CuentasCobrar3Component implements OnInit {

  fechasForm!: FormGroup;
  pagosDetalles: PagosServicioDetalle[] = [];

  constructor( private pagosServicioService: PagosServiciosService ) {}

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario() {
    this.fechasForm = new FormGroup({
      inicio: new FormControl(null, Validators.required),
      fin: new FormControl(null, Validators.required),
    });
  }

  /* === LISTAR CUENTAS PAGADAS SEGUN RANGO DE FECHAS === */
  listarCuentas(){
  if (this.fechasForm.invalid) return;

  this.pagosServicioService.getDetallePagoFechas( this.fechasForm.get('inicio')?.value, this.fechasForm.get('fin')?.value )
  .subscribe({
    next: (resp)=> this.pagosDetalles = resp,
    error: err=> console.log(err),
    complete: ()=> this.filtrarCuentasPorCobrar(this.pagosDetalles)
  });

  }


  filtrarCuentasPorCobrar(cuentas:PagosServicioDetalle[] ){
    // cuentas.
  }

}
