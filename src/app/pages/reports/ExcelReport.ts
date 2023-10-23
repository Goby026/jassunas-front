import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

import { PagosServicio } from 'src/app/models/pagosservicio.model';

export class ExcelReport{

  constructor(
    // public data: Param[],
    // public idCliente: number
){}



  public reportComprobantesIngreso(pagosServicios: PagosServicio[]){

    if(!(pagosServicios.length > 0)){
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: PagosServicio[] = [...pagosServicios];
    let excelData:any[] = data.map( (item: PagosServicio, index)=>{
      return {
        Id: index + 1,
        cliente: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        Servicio: item.tipoPagoServicios.descripcion,
        Estado: item.pagoServicioEstado.descripcion,
        Periodo: item.fecha,
        Monto: item.montopagado,
      }
    });

    const cabeceras = [['ID','CLIENTE', 'SERVICIO', 'ESTADO', 'PERIODO', 'MONTO']];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `Reporte_1_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`);

  }

  public reportIngresoMensual(pagosServicios: PagosServicio[]){

    if(!(pagosServicios.length > 0)){
      alert('¡No hay datos para crear reporte!');
      return;
    }

    let data: PagosServicio[] = [...pagosServicios];
    let excelData:any[] = data.map( (item: PagosServicio, index)=>{
      return {
        FECHA: item.fecha,
        REGISTRO: '',
        COMPROBANTE_COBRANZA: item.correlativo,
        SOCIO: `${item.cliente.apepaterno} ${item.cliente.apematerno} ${item.cliente.nombres}`,
        IMPORTE: item.montopagado,
        DETALLE: item.observacion,
      }
    });

    const cabeceras = [['FECHA','REGISTRO', 'COMPROBANTE_COBRANZA', 'SOCIO', 'IMPORTE', 'DETALLE']];
    const wb = XLSX.utils.book_new();
    const ws: any = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, cabeceras);
    XLSX.utils.sheet_add_json(ws, excelData, {
      origin: 'A2',
      skipHeader: true
    });

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `Reporte_2_${moment().format('MMMM Do YYYY, h:mm:ss a')}.xlsx`);

  }


}
