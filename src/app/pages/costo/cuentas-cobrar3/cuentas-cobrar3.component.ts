import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Deuda } from 'src/app/models/deuda.model';
import { DeudaService } from 'src/app/services/deuda.service';
import { ExcelReport } from '../../reports/ExcelReport';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuentas-cobrar3',
  templateUrl: './cuentas-cobrar3.component.html',
})
export class CuentasCobrar3Component implements OnInit {
  fechasForm!: FormGroup;
  data: boolean = false;
  deudas: Deuda[] = [];

    /* PAGINACION */
    page: number = 1;
    count: number = 0;
    tableSize: number = 10;
    tableSizes: number[] = [5, 10, 15, 20];

  constructor(private deudaService: DeudaService) {}

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
  listarCuentas() {
    if (this.fechasForm.invalid) return;

    this.data = true;

    this.deudaService
      .geDebtsByPeriodRange(
        this.fechasForm.get('inicio')?.value,
        this.fechasForm.get('fin')?.value
      )
      .subscribe({
        next: (resp) => (this.deudas = resp),
        error: (err) => console.log(err),
        complete: ()=> this.data = false
      });
  }

  crearReporte() {
    Swal.fire({
      title: '¿Generar archivo Excel?',
      text: 'Se descargará el archivo',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let reporte: ExcelReport = new ExcelReport();
        reporte.reportCuentasPorCobrar(this.deudas);
      }
    });
  }

  onTableDataChange(event: any) {
    this.page = event;
    // this.listarCajas();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    // this.listarCajas();
  }
}
