import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Caja } from 'src/app/models/caja.model';
import { Egreso } from 'src/app/models/egreso.model';
import { CajaService } from 'src/app/services/caja.service';
import { DeudaService } from 'src/app/services/deuda.service';
import { EgresoService } from 'src/app/services/egreso.service';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';

import * as moment from 'moment';
import { ExcelReport } from '../../reports/ExcelReport';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { PagosServicio } from 'src/app/models/pagosservicio.model';

@Component({
  selector: 'app-conceptos-cobrados5',
  templateUrl: './conceptos-cobrados5.component.html',
})
export class ConceptosCobrados5Component implements OnInit {
  fechasForm!: FormGroup;
  data: boolean = false;

  idcaja!: number;
  caja!: Caja;
  pagosServiciosDeta: PagosServicioDetalle[] = [];
  pagosServicios: PagosServicio[] = [];
  egresos: Egreso[] = [];

  totalEgresos: number = 0;
  balance: number = 0;

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5, 10, 15, 20];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _pagoServicios: PagosServiciosService,
    private cajaService: CajaService,
    private egresoService: EgresoService,
    private deudaService: DeudaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario() {
    this.fechasForm = new FormGroup({
      inicio: new FormControl([null, Validators.required]),
      fin: new FormControl([null, Validators.required]),
    });
  }

  cargarAllDetallePagos() {
    if (this.fechasForm.invalid) {
      alert('Indicar correctamente fechas');
    }

    this.data = true;

    this._pagoServicios
      .getDetallePagoFechas(
        this.fechasForm.get('inicio')?.value,
        this.fechasForm.get('fin')?.value
      )
      .subscribe({
        next: (resp) => {
          this.pagosServiciosDeta = resp;
        },
        error: (err) => console.log(err),
        complete: () => this.data = false,
      });
  }

  cargarAllPagos(){
    if (this.fechasForm.invalid) {
      alert('Indicar correctamente fechas');
    }

    this.data = true;

    this._pagoServicios
      .getPagosBetweenDates(
        this.fechasForm.get('inicio')?.value,
        this.fechasForm.get('fin')?.value
      )
      .subscribe({
        next: (resp) => {
          this.pagosServicios = resp;
        },
        error: (err) => console.log(err),
        complete: () => this.data = false,
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
        reporte.reportConceptosCobrados(this.pagosServicios);
      }
    });
  }

  recargarSeguimiento() {
    this.router
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([`/dashboard/seguimiento/${this.idcaja}`]);
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
