import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Requisito } from 'src/app/models/requisito.model';
import { TributoDetalle } from 'src/app/models/tributoDetalle.model';
import { ByTributoDatesReport } from '../../reports/ByTributoDatesReport';

import Swal from 'sweetalert2';
import * as moment from 'moment';
import 'moment/locale/es';
import { ExcelReport } from '../../reports/ExcelReport';
import { TributoService } from 'src/app/services/tributo.service';
import { RequisitoService } from 'src/app/services/requisito.service';

@Component({
  selector: 'app-conceptos-cobrables4',
  templateUrl: './conceptos-cobrables4.component.html',
})
export class ConceptosCobrables4Component implements OnInit {
  requisitoForm!: FormGroup;
  detalles: TributoDetalle[] = [];
  requisitos: Requisito[] = [];
  req: Requisito[] = [];

  data: boolean = false;

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5, 10, 15, 20];

  constructor(
    private tributoService: TributoService,
    private requisitoService: RequisitoService
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.listarRequisitos();
  }

  crearFormulario() {
    this.requisitoForm = new FormGroup({
      tributo: new FormControl(null, Validators.required),
      inicio: new FormControl(null, Validators.required),
      fin: new FormControl(null, Validators.required),
    });
  }

  listarRequisitos() {
    this.requisitoService.getAllRequisitos().subscribe({
      next: (resp) => (this.requisitos = resp),
      error: (err) => console.log(err),
    });
  }

  listarPagosTributos() {
    if (!this.requisitoForm.valid) {
      alert('Indique correctamente los parámetros');
      return;
    }

    this.data = true;

    let f_inicial: string = moment(
      this.requisitoForm.get('inicio')?.value
    ).format('yyyy-MM-DD');
    let f_final: string = moment(this.requisitoForm.get('fin')?.value)
      .add(1, 'days')
      .format('yyyy-MM-DD');

    this.tributoService
      .getDetallesTributoDates(
        Number(this.requisitoForm.get('tributo')?.value),
        f_inicial,
        f_final
      )
      .subscribe({
        next: (resp) => {
          this.detalles = resp;
        },
        error: (err) => console.log(err),
        complete: () => {
          this.req = this.requisitos.filter((item) => {
            return (
              item.codrequi === Number(this.requisitoForm.get('tributo')?.value)
            );
          });

          this.data = false;
        },
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
        reporte.reportConceptosCobrables(this.detalles);
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
