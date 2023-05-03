import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoEgreso } from 'src/app/models/tipoegreso.model';
import { TipoegresoService } from 'src/app/services/tipoegreso.service';

@Component({
  selector: 'app-form-cate',
  templateUrl: './form-cate.component.html'
})
export class FormCateComponent implements OnInit {

  @Input() tipoEgresos!: TipoEgreso[];
  @Input() id: number = 0;
  @Output() cerrar = new EventEmitter<boolean>();
  @Output() actualizar = new EventEmitter<boolean>();

  categoriasForm!: FormGroup;
  public tipoFiltered!: TipoEgreso[];

  constructor( private tipoEgresoService: TipoegresoService ) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(): void {
    this.categoriasForm = new FormGroup({
      descripcion: new FormControl('', Validators.required)
    });
  }

  registrarCategoria(): void {
    if (!this.categoriasForm.valid) {
      alert('Ingrese correctamente los datos!');
      return;
    }

    if (confirm('¿Registrar nueva Categoría?')) {
      let newTipo: TipoEgreso = {
        descripcion: this.categoriasForm.get('descripcion')?.value,
        estado: 1
      };

      this.tipoEgresoService.save(newTipo).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
        complete: () => {
          this.actualizar.emit(true);
          alert('Categoría registrada correctamente!');
        },
      });
    }
  }

  mostrarTarifa(): void {
    if (this.id !== 0) {
      this.tipoFiltered = this.tipoEgresos.filter((item) => {
        return item.idtipoegreso == this.id;
      });

      this.categoriasForm.setValue({
        descripcion: this.tipoFiltered[0].descripcion
      });
    }
  }

  actualizarTipo(): void {
    if (!this.categoriasForm.valid) {
      alert('Ingrese correctamente los datos!');
      return;
    }

    // if (this.tarifaFiltered[0].idtarifario === 0) {
    //   alert('No se seleccionó ninguna tarifa!');
    //   return;
    // }

    if (confirm('¿Modificar Categoría Seleccionada?')) {
      let toUpdateTipoEgreso: TipoEgreso = {
        idtipoegreso: this.tipoFiltered[0].idtipoegreso,
        descripcion: this.categoriasForm.get('descripcion')?.value,
        estado: 1,
      };

      this.tipoEgresoService.update(toUpdateTipoEgreso).subscribe({
        next: () => {},
        error: (err) => console.log(err),
        complete: () => {
          alert('Categoría actualizada');
          this.actualizar.emit(true);
        },
      });
    }
  }

  close(): void {
    this.cerrar.emit(true);
  }

}
