import { Component, OnInit } from '@angular/core';
import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { PagosServiciosService } from 'src/app/services/pagos-servicios.service';
import { ExcelReport } from '../../reports/ExcelReport';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comprobantes-ingreso1',
  templateUrl: './comprobantes-ingreso1.component.html',
})
export class ComprobantesIngreso1Component implements OnInit {
  allPagos!: PagosServicio[];

  /* PAGINACION */
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: number[] = [5, 10, 15, 20];

  constructor(private pagosServicioService: PagosServiciosService) {}

  ngOnInit(): void {
    this.listarComprobantesIngreso();
  }

  listarComprobantesIngreso() {
    this.pagosServicioService.getAllPagos().subscribe({
      next: (resp: PagosServicio[]) => {
        this.allPagos = resp;
      },
      error: (err) => console.log(err),
      // complete:
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
        reporte.reportComprobantesIngreso(this.allPagos);
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
