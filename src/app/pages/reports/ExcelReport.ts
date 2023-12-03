import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

import { PagosServicio } from 'src/app/models/pagosservicio.model';
import { PagosServicioDetalle } from 'src/app/models/pagosserviciodeta.model';
import { Deuda } from 'src/app/models/deuda.model';
import { TributoDetalle } from 'src/app/models/tributoDetalle.model';

export class ExcelReport {
  constructor() // public data: Param[],
  // public idCliente: number
  {}

  public reportComprobantesIngreso(pagosServicios: PagosServicio[]) {
    if (!(pagosServicios.length > 0)) {
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: PagosServicio[] = [...pagosServicios];
    let excelData: any[] = data.map((item: PagosServicio, index) => {
      return {
        Id: index + 1,
        cliente: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        Servicio: item.tipoPagoServicios.descripcion,
        Estado: item.pagoServicioEstado.descripcion,
        Periodo: item.fecha,
        Monto: item.montopagado,
      };
    });

    const cabeceras = [
      ['ID', 'CLIENTE', 'SERVICIO', 'ESTADO', 'PERIODO', 'MONTO'],
    ];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(
      wb,
      `Reporte_1_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`
    );
  }

  public reportIngresoMensual(pagosServicios: PagosServicio[]) {
    if (!(pagosServicios.length > 0)) {
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: PagosServicio[] = [...pagosServicios];
    let excelData: any[] = data.map((item: PagosServicio, index) => {
      return {
        FECHA: item.fecha,
        REGISTRO: '',
        COMPROBANTE_COBRANZA: item.correlativo,
        SOCIO: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        IMPORTE: item.montopagado,
        DETALLE: item.observacion,
      };
    });

    const cabeceras = [
      [
        'FECHA',
        'REGISTRO',
        'COMPROBANTE_COBRANZA',
        'SOCIO',
        'IMPORTE',
        'DETALLE',
      ],
    ];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(
      wb,
      `Reporte_2_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`
    );
  }

  public reportCuentasPorCobrar(deudas: Deuda[]) {
    if (!(deudas.length > 0)) {
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: Deuda[] = [...deudas];
    let excelData: any[] = data.map((item: Deuda, index) => {
      return {
        PERIODO: item.periodo,
        COMPROBANTE: 'S/C',
        SOCIO: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        IMPORTE: item.total,
        OBSERVACION: item.observacion,
      };
    });

    const cabeceras = [
      ['PERIODO', 'COMPROBANTE', 'SOCIO', 'IMPORTE', 'OBSERVACION'],
    ];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(
      wb,
      `Reporte_3_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`
    );
  }

  public reportConceptosCobrables(detalles: TributoDetalle[]) {
    if (!(detalles.length > 0)) {
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: TributoDetalle[] = [...detalles];
    let excelData: any[] = data.map((item: TributoDetalle, index) => {
      return {
        NUM: index + 1,
        SOCIO: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        DIRECCION: item.direccion,
        FECHA: item.createdAt,
        MONTO: item.monto,
      };
    });

    const cabeceras = [['NUM', 'SOCIO', 'DIRECCION', 'FECHA', 'MONTO']];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(
      wb,
      `Reporte_4_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`
    );
  }

  public reportConceptosCobrados(pagosServicios: PagosServicio[]) {
    if (!(pagosServicios.length > 0)) {
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: PagosServicio[] = [...pagosServicios];
    let excelData: any[] = data.map((item: PagosServicio, index) => {
      return {
        CAJA: item.caja.ncaja,
        RECIBO: item.correlativo,
        SOCIO: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        CONCEPTO: item.tipoPagoServicios.descripcion,
        FECHA: item.fecha,
        MONTO: item.montopagado,
        DCTO: item.montodescuento,
        COBRADO_POR: item.usuario?.username || '',
      };
    });

    const cabeceras = [
      [
        'CAJA',
        'RECIBO',
        'SOCIO',
        'CONCEPTO',
        'FECHA',
        'MONTO',
        'DCTO',
        'COBRADO_POR',
      ],
    ];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(
      wb,
      `Reporte_5_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`
    );
  }
}
