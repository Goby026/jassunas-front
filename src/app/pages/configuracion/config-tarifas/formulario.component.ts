import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Servicio } from 'src/app/models/servicio.model';
import { Tarifario } from 'src/app/models/tarifario.model';
import { TarifasService } from 'src/app/services/tarifas.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html'
})
export class FormularioComponent implements OnInit {
  @Input() tarifas!: Tarifario[];
  @Input() id: number = 0;
  @Output() cerrar = new EventEmitter<boolean>();
  @Output() actualizar = new EventEmitter<boolean>();

  public tarifaFiltered!: Tarifario[];
  public tarifaForm!: FormGroup;
  servicio: Servicio;
  tarifaDescripcion!: any[];

  constructor(private tarifasService: TarifasService) {
    this.servicio = {
      detaservicios: null,
      estado: null,
      codservi: 2,
    };
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.mostrarTarifa();
  }

  crearFormulario(): void {
    this.tarifaForm = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0.0, Validators.required),
    });
  }

  registrarTarifa(): void {
    if (!this.tarifaForm.valid) {
      alert('Ingrese correctamente los datos!');
      return;
    }

    if (confirm('¿Registrar nueva Tarifa?')) {
      let newTarifa: Tarifario = {
        detalletarifario: this.tarifaForm.get('descripcion')?.value,
        monto: this.tarifaForm.get('monto')?.value,
        servicio: this.servicio,
        esta: 1,
      };

      this.tarifasService.saveTarifa(newTarifa).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
        complete: () => {
          this.actualizar.emit(true);
          alert('Tarifa registrada correctamente!');
        },
      });
    }
  }

  mostrarTarifa(): void {
    if (this.id !== 0) {
      this.tarifaFiltered = this.tarifas.filter((item) => {
        return item.idtarifario == this.id;
      });

      this.tarifaForm.setValue({
        descripcion: this.tarifaFiltered[0].detalletarifario,
        monto: this.tarifaFiltered[0].monto,
      });
    }
  }

  // MODIFICAR
  actualizarTarifa(): void {
    if (!this.tarifaForm.valid) {
      alert('Ingrese correctamente los datos!');
      return;
    }

    console.log('ID----->', this.id);

    // if (this.tarifaFiltered[0].idtarifario === 0) {
    //   alert('No se seleccionó ninguna tarifa!');
    //   return;
    // }

    if (confirm('¿Modificar Tarifa Seleccionada?')) {
      let toUpdateTarifa: Tarifario = {
        idtarifario: this.tarifaFiltered[0].idtarifario,
        detalletarifario: this.tarifaForm.get('descripcion')?.value,
        monto: this.tarifaForm.get('monto')?.value,
        servicio: this.servicio,
        esta: 1,
      };

      this.tarifasService.updateTarifa(toUpdateTarifa).subscribe({
        next: () => {},
        error: (err) => console.log(err),
        complete: () => {
          alert('Tarifa actualizada');
          this.actualizar.emit(true);
        },
      });
    }
  }

  // desactivarTarifa(): void {
  //   this.tarifasService.disableTarifa(this.tarifaFiltered[0]).subscribe({
  //     next: () => {},
  //     error: (err) => console.log(err),
  //     complete: () => {
  //       alert('Tarifa desactivada');
  //       this.actualizar.emit(true);
  //     },
  //   });
  // }

  close(): void {
    this.cerrar.emit(true);
  }
}
