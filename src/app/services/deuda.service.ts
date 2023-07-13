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

  // ************obtener deudas con estado pendiente************
  getUserDebt(idCliente: number) {
    return this.http.get(`${base_url}/deudas/buscar/${idCliente}`).pipe(
      map((resp: any) => {
        if (resp) {
          return resp.deudas.filter((item: any) => {
            return item.deudaEstado.iddeudaEstado === 3;
          });
        } else {
          return [];
        }
      })
    );
    // return this.http.get(`${base_url}/deudas/buscar/${idCliente}`);
  }

  // ************TODAS LAS DEUDAS************
  getAllUserDebt(idCliente: number) : Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar/${idCliente}`)
      .pipe(map((resp: any) => resp.deudas as Deuda[]));
    // return this.http.get(`${base_url}/deudas/buscar/${idCliente}`);
  }

// ************DEUDAS POR ZONA Y POR AÑO************
  geDebtsByZoneAndYear(idzona: number, year: number): Observable<Deuda[]> {
    return this.http
      .get(`${base_url}/deudas/buscar-zona/${idzona}/${year}`)
      .pipe(
        map((resp: any) => {
          return resp.deudas as Deuda[];
        })
      );
  }

// ************DEUDAS POR ZONA Y POR RANGO DE FECHAS************
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

// ************DEUDAS POR CLIENTE Y POR RANGO DE FECHAS************
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

// ************DEUDAS POR ZONA************
  geDebtsByZone(idzona: number): Observable<Deuda[]> {
    return this.http.get(`${base_url}/deudas/buscar-zona/${idzona}`).pipe(
      map((resp: any) => {
        return resp.deudas as Deuda[];
      })
    );
  }

  //************actualizar estado de arreglo de deudas************
  updateUserDebts(deuda: Deuda[]): Observable<Deuda[]> {
    return this.http
      .put(`${base_url}/deudas/service`, deuda)
      .pipe(map((res: any) => res.deudas as Deuda[]));
  }

  //************actualizar deuda por id************
  updateUserDebt(deuda: Deuda): Observable<Deuda> {
    return this.http
      .put<Deuda>(`${base_url}/deuda/${deuda.idtbdeudas}`, deuda);
  }

  // ************listar tipos de deudas************
  getAllDeudaDescripcion() : Observable<DeudaDescripcion[]> {
    return this.http
      .get(`${base_url}/tipodeudas`)
      .pipe(map((resp: any) => resp.tipodeudas as DeudaDescripcion[]));
    // return this.http.get(`${base_url}/deudas/buscar/${idCliente}`);
  }
}
