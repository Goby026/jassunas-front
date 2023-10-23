import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagosServicio } from '../models/pagosservicio.model';
import { PagosServicioDetalle } from '../models/pagosserviciodeta.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class PagosServiciosService {
  constructor(private http: HttpClient) {}

  /* === OBTENER TODOS LOS PAGOS=== */
  getAllPagos(): Observable<PagosServicio[]> {
    return this.http
      .get(`${base_url}/pagos-servicio`)
      .pipe(map((resp: any) => resp.pagosservicios as PagosServicio[]));
  }

  /* === REGISTRAR PAGO DE SERVICIO=== */
  savePagoServicio(pago: PagosServicio): Observable<PagosServicio> {
    return this.http.post<PagosServicio>(`${base_url}/pagos-servicio`, pago);
  }

  /* === REGISTRAR PAGOS-SERVICIO Y DETALLE-PAGOS-SERVICIOS === */
  savePagosAndDetalles(pago: PagosServicio, detalles: PagosServicioDetalle[]) {
    let p: string = JSON.stringify(pago);
    let d: string = JSON.stringify(detalles);

    let formData = new FormData();
    formData.append('pagoservicio', p);
    formData.append('detalles', d);

    return this.http.post(`${base_url}/pagos-servicio/save`, formData).pipe(
      catchError((err) => {
        // maneja el error aquí
        console.error('ERRRRROOOOOOOOR---------------------->', err);
        return of([]); // devuelve un observable vacío en lugar de propagar el error
      })
    );
  }

  /* === ACTUALIZAR (anulaciones) pagoServicio === */
  updatePagosServicio(pago: PagosServicio): Observable<PagosServicio> {
    return this.http
      .put(`${base_url}/pagos-servicio/${pago.id}`, pago)
      .pipe(map((res: any) => res.pagosservicio as PagosServicio));
  }

  /* === REGISTRAR DETALLES DE PAGO DE SERVICIO === */
  savePagosServicioDetalle(pagoServicio: any[]) {
    return this.http.post(`${base_url}/pagos-deta/service`, pagoServicio);
  }

  /* === OBTENER PAGOS DE CLIENTE === */
  getPagosByCliente(idCliente: number): Observable<PagosServicio[]> {
    return this.http
      .get(`${base_url}/pagos-servicio/cliente/${idCliente}`)
      .pipe(
        map((resp: any) => {
          return resp.pagosservicios as PagosServicio[];
        })
      );
  }

  /* === OBTENER CORRELATIVO === */
  getContador(): Observable<number> {
    return this.http.get(`${base_url}/pagos-servicio/count`).pipe(
      map((resp: any) => {
        return resp.correlativo;
      })
    );
  }

  /* === OBTENER DETALLES DE PAGOS DE UN CLIENTE === */
  getDetallePagosCliente(
    idcliente: number
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/cliente/${idcliente}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  /* === OBTENER LOS DETALLES DE PAGOS DE UN CLIENTE POR AÑO ===*/
  getDetallePagosClienteAnio(
    idcliente: number,
    anio: number
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/anio/${idcliente}/${anio}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  /* === OBTENER LOS DETALLES SEGUN RANGO DE FECHAS === */
  getDetallePagoFechas(
    desde: string,
    hasta: string
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/fechas/${desde}/${hasta}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  /* === OBTENER LOS DETALLES DE UN DETERMINADO PAGO === */
  getDetallePago(idpago: number): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/pago/${idpago}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  /* === OBTENER PAGOS POR TRIBUTO === */
  getPagosTributos(
    idTributo: number,
    desde: string,
    hasta: string
  ): Observable<PagosServicio[]> {
    return this.http
      .get<PagosServicio[]>(
        `${base_url}/pagos-servicio/tributo/${idTributo}/${desde}/${hasta}`
      )
      .pipe(
        map((res: any) => {
          return res.pagos as PagosServicio[];
        })
      );
  }

    /* === OBTENER PAGOS POR AÑO Y MES === */
    getPagosYearMonth(param: string): Observable<PagosServicio[]> {
      return this.http
        .get(`${base_url}/pagos-servicio/year-month/${param}`)
        .pipe(map((resp: any) => resp.pagosservicios as PagosServicio[]));
    }

  tracking(idCaja: number) {
    return this.http.get(`${base_url}/pagos-servicio/caja/${idCaja}`);
  }
}
