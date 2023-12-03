import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Deuda } from '../models/deuda.model';
import { DeudaDescripcion } from '../models/deudadescripcion.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class DeudaService {
  constructor(private http: HttpClient) {}

  //* ===============OBTENER DEUDAS CON ESTADO PENDIENTE===============
  getAllDebts(): Observable<Deuda[]> {
    return this.http.get(`${base_url}/deudas`)
    .pipe(
      map( (resp: any)=> {
        return resp.deudas as Deuda[]
      } )
    );
  }

  //* ===============OBTENER DEUDAS CON ESTADO PENDIENTE===============
  getUserDebt(idCliente: number, idEstado = 3) {
    return this.http.get(`${base_url}/deudas/buscar/${idCliente}`).pipe(
      map((resp: any) => {
        if (resp) {
          return resp.deudas.filter((item: any) => {
            return item.deudaEstado.iddeudaEstado === idEstado;
          });
        } else {
          return [];
        }
      })
    );
  }

  //* ===============REGISTRAR DEUDA===============
  saveUserDebt(deuda: Deuda): Observable<Deuda> {
    return this.http
      .post<Deuda>(`${base_url}/deudas`, deuda);
  }

  //* ===============REGISTRAR VARIAS DEUDAS===============
  saveAllUserDebt(deudas: Deuda[]): Observable<Deuda[]> {
    return this.http
      .post(`${base_url}/deudas-all`, deudas).pipe(
        map( (res: any)=> res.deudas as Deuda[] )
      );
  }

  //* ===============DEUDAS POR ID DE CLIENTE===============
  getAllUserDebt(idCliente: number): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar/${idCliente}`)
      .pipe(map((resp: any) => resp.deudas as Deuda[]));
  }

  //* ===============DEUDAS POR ZONA Y POR AÑO===============
  geDebtsByZoneAndYear(idzona: number, year: number): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-zona/${idzona}/${year}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

  //* ===============DEUDAS POR RANGO DE FECHAS===============
  geDebtsByPeriodRange(
    desde: String,
    hasta: String
  ): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-periodo/${desde}/${hasta}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

  //* ===============DEUDAS POR ZONA Y POR RANGO DE FECHAS===============
  geDebtsByZoneAndDateRange(
    idzona: number,
    desde: String,
    hasta: String
  ): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-zona/${idzona}/${desde}/${hasta}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

  //* ===============DEUDAS POR CLIENTE Y POR RANGO DE FECHAS===============
  geDebtsByClientAndDateRange(
    idcliente: number,
    desde: String,
    hasta: String
  ): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-cliente/${idcliente}/${desde}/${hasta}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

  //* ===============DEUDAS POR CLIENTE Y POR RANGO DE FECHAS===============
  geDebtsByClient(
    idcliente: number,
    desde: String,
    hasta: String
  ): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-cliente/${idcliente}/${desde}/${hasta}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

  //* ===============DEUDAS POR ZONA===============
  geDebtsByZone(idzona: number): Observable<Deuda[]> {
    return this.http.get(`${base_url}/deudas/buscar-zona/${idzona}`).pipe(
      map((resp: any) => {
        return resp.deudas as Deuda[];
      })
    );
  }

  //* ===============ACTUALIZAR ESTADO DE ARREGLO DE DEUDAS===============
  updateUserDebts(deuda: Deuda[]): Observable<Deuda[]> {
    return this.http
      .put(`${base_url}/deudas/service`, deuda)
      .pipe(map((res: any) => res.deudas as Deuda[]));
  }

  //* ===============ACTUALIZAR DEUDA POR ID===============
  updateUserDebt(deuda: Deuda): Observable<Deuda> {
    return this.http.put<Deuda>(`${base_url}/deuda/${deuda.idtbdeudas}`, deuda);
  }

  //* ===============LISTAR TIPOS DE DEUDA===============
  getAllDeudaDescripcion(): Observable<DeudaDescripcion[]> {
    return this.http
      .get(`${base_url}/tipodeudas`)
      .pipe(map((resp: any) => resp.tipodeudas as DeudaDescripcion[]));
  }

  //* ===============VERIFICAR SI SOCIO TIENE MULTA PENDIENTE===============
  verifyPenalty( deudas: Deuda[] ): boolean {
    let penalty : boolean = false;

    deudas.forEach( (item)=> {
      if((item.deudaDescripcion.iddeudadescripcion == 3 || item.deudaDescripcion.iddeudadescripcion == 4 || item.deudaDescripcion.iddeudadescripcion == 5) && item.deudaEstado.iddeudaEstado== 3){
        penalty = true;
      }
    } )

    return penalty;
  }
}
