import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagosServicio } from '../models/pagosservicio.model';
import { PagosServicioDetalle } from '../models/pagosserviciodeta.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PagosServiciosService {

  constructor( private http: HttpClient ) { }

  // registrar pago de servicio
  savePagoServicio(pago: PagosServicio):Observable<PagosServicio>{
    return this.http.post<PagosServicio>(`${base_url}/pagos-servicio`,pago);
  }

  // registrar detalles de pago de servicio
  savePagosServicioDetalle( pagoServicio: any[] ){
    return this.http.post(`${base_url}/pagos-deta/service`,pagoServicio);
  }

  // metodo para obtener historial del cliente
  getHistorial(idCliente: number): Observable<PagosServicioDetalle[]>{
    return this.http.get(`${base_url}/pagos-deta/cliente/${idCliente}`).pipe(
      map( (resp:any)=>{
        return resp.pagosdeta as PagosServicioDetalle[]
      } )
    );
  }

  // metodo para obtener el correlativo
  getContador(): Observable<number>{
    return this.http.get(`${base_url}/pagos-servicio/count`).pipe(
      map( (resp:any)=>{
        return resp.correlativo
      } )
    );
  }

  tracking(idCaja : number){
    return this.http.get(`${base_url}/pagos-servicio/caja/${idCaja}`);
  }
}
