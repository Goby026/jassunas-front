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

  // registrar pago de servicio
  savePagoServicio(pago: PagosServicio): Observable<PagosServicio> {
    return this.http.post<PagosServicio>(`${base_url}/pagos-servicio`, pago);
  }

  // REGISTRAR PAGOS-SERVICIO Y DETALLE-PAGOS-SERVICIOS
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

  // actualizar (anulaciones) pagoServicio
  updatePagosServicio(pago: PagosServicio):Observable<PagosServicio>{
    return this.http.put(`${base_url}/pagos-servicio/${pago.id}`, pago)
    .pipe(
      map( (res: any)=> res.pagosservicio as PagosServicio )
    );
  }

  // registrar detalles de pago de servicio
  savePagosServicioDetalle(pagoServicio: any[]) {
    return this.http.post(`${base_url}/pagos-deta/service`, pagoServicio);
  }

  // metodo para obtener PAGOS de cliente
  getPagosByCliente(idCliente: number): Observable<PagosServicio[]> {
    return this.http
      .get(`${base_url}/pagos-servicio/cliente/${idCliente}`)
      .pipe(
        map((resp: any) => {
          return resp.pagosservicios as PagosServicio[];
        })
      );
  }

  // metodo para obtener el correlativo
  getContador(): Observable<number> {
    return this.http.get(`${base_url}/pagos-servicio/count`).pipe(
      map((resp: any) => {
        return resp.correlativo;
      })
    );
  }

  //metodo para obtener los detalles de pagos de un cliente
  getDetallePagosCliente(
    idcliente: number
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/cliente/${idcliente}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  //metodo para obtener los detalles de pagos de un cliente por año
  getDetallePagosClienteAnio(
    idcliente: number,
    anio: number
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/anio/${idcliente}/${anio}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  //metodo para obtener los detalles segun rango de fechas
  getDetallePagoFechas(
    desde: string,
    hasta: string
  ): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/fechas/${desde}/${hasta}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  //metodo para obtener los detalles de un determinado PAGO
  getDetallePago(idpago: number): Observable<PagosServicioDetalle[]> {
    return this.http
      .get(`${base_url}/pagos-deta/pago/${idpago}`)
      .pipe(map((resp: any) => resp.pagosdeta as PagosServicioDetalle[]));
  }

  tracking(idCaja: number) {
    return this.http.get(`${base_url}/pagos-servicio/caja/${idCaja}`);
  }
}
