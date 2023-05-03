import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { Caja } from 'src/app/models/caja.model';
import { Egreso } from 'src/app/models/egreso.model';
import { TipoEgreso } from 'src/app/models/tipoegreso.model';
import { EgresoService } from 'src/app/services/egreso.service';
import { TipoegresoService } from 'src/app/services/tipoegreso.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-egresoform',
  templateUrl: './egresoform.component.html',
})
export class EgresoformComponent implements OnInit {
  @Input() egresos!: Egreso[];
  @Input() caja!: Caja;
  @Input() id: number = 0;
  @Output() cerrar = new EventEmitter<boolean>();
  @Output() actualizar = new EventEmitter<boolean>();

  egresoFiltered!: Egreso[];
  tiposEgresos!: TipoEgreso[];
  egresoForm!: FormGroup;

  constructor(
    private tipoEgresosService: TipoegresoService,
    private egresoService: EgresoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.getTiposEgresos();
    this.crearFormulario();
    this.mostrarEgreso();
  }

  crearFormulario(): void {
    this.egresoForm = new FormGroup({
      nregistro: new FormControl(null, Validators.required),
      fecha: new FormControl(null, Validators.required),
      documento: new FormControl(null, Validators.required),
      nombrerazon: new FormControl(null, Validators.required),
      detalle: new FormControl(null, Validators.required),
      importe: new FormControl(null, Validators.required),
      tipoEgreso: new FormControl(null, Validators.required),
    });
  }

  getTiposEgresos(): void {
    this.tipoEgresosService.getAll().subscribe({
      next: (resp: TipoEgreso[]) => (this.tiposEgresos = resp),
      error: (err) => console.log(err),
    });
  }

  // REGISTRAR
  registrar(): void {
    if (!this.egresoForm.valid) {
      alert('Ingrese correctamente los campos!');
      return;
    }

    if (!confirm('¿Registrar Egreso?')) {
      return;
    }

    let tipo: TipoEgreso[] = this.tiposEgresos.filter( (item)=> {
      return item.idtipoegreso === Number(this.egresoForm.get('tipoEgreso')?.value)
    });

    let newEgreso: Egreso = {
      nregistro: this.egresoForm.get('nregistro')?.value,
      fecha: this.egresoForm.get('fecha')?.value,
      documento: this.egresoForm.get('documento')?.value,
      nombrerazon: this.egresoForm.get('nombrerazon')?.value,
      detalle: this.egresoForm.get('detalle')?.value,
      importe: this.egresoForm.get('importe')?.value,
      estado: 1,
      caja: this.caja,
      tipoEgreso: tipo[0],
      usuario: this.usuarioService.getLocalUser(),
    };

    this.egresoService.save(newEgreso).subscribe({
      next: (resp: Egreso) => console.log('------>', resp),
      error: (err) => console.log(err),
      complete: () => this.actualizar.emit(true),
    });
  }

  mostrarEgreso(): void {
      if (this.id !== 0) {
      this.egresoFiltered = this.egresos.filter((item) => {
        return item.idegreso == this.id;
      });

      this.egresoForm.setValue({

      nregistro: this.egresoFiltered[0].nregistro,
      fecha: new Date(this.egresoFiltered[0].fecha).getDate,
      documento: this.egresoFiltered[0].documento,
      nombrerazon: this.egresoFiltered[0].nombrerazon,
      detalle: this.egresoFiltered[0].detalle,
      importe: this.egresoFiltered[0].importe,
      tipoEgreso: this.egresoFiltered[0].tipoEgreso.idtipoegreso,

      });

      console.log(this.egresoFiltered[0]);
    }
  }

  // MODIFICAR
  actualizarEgreso(id:  number): void {
    if (!this.egresoForm.valid) {
      alert('Ingrese correctamente los datos!');
      return;
    }

    if (id <= 0) {
      alert('No se seleccionó ninguna categoria de egreso!');
      return;
    }

    if (confirm('¿Modificar Egreso Seleccionado?')) {

      let tipo: TipoEgreso[] = this.tiposEgresos.filter( (item)=> {
        return item.idtipoegreso === Number(this.egresoForm.get('tipoEgreso')?.value)
      });

      let toUpdateEgreso: Egreso = {
        idegreso: id,
        nregistro: this.egresoForm.get('nregistro')?.value,
        fecha: this.egresoForm.get('fecha')?.value,
        documento: this.egresoForm.get('documento')?.value,
        nombrerazon: this.egresoForm.get('nombrerazon')?.value,
        detalle: this.egresoForm.get('detalle')?.value,
        importe: this.egresoForm.get('importe')?.value,
        estado: 1,
        caja: this.caja,
        tipoEgreso: tipo[0],
        usuario: this.usuarioService.getLocalUser(),
      };

      this.egresoService.update(toUpdateEgreso).subscribe({
        next: () => {},
        error: (err) => console.log(err),
        complete: () => {
          alert('Tarifa actualizada');
          this.actualizar.emit(true);
        },
      });
    }
  }

  close(): void {
    this.cerrar.emit(true);
  }
}
