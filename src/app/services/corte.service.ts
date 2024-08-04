import { Corte } from 'src/app/models/corte.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CorteDetalle } from '../models/cortedetalle.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CorteService {
  constructor(private http: HttpClient) {}

  getCortes(): Observable<Corte[]> {
    return this.http
      .get(`${base_url}/cortes`)
      .pipe(map((resp: any) => resp.cortes as Corte[]));
  }

  saveCorte(corte: Corte): Observable<Corte> {
    return this.http.post<Corte>(`${base_url}/cortes`, corte).pipe(
      catchError((e) => {
        console.log(e.error);
        return throwError(e);
      })
    );
  }

  saveCorteDetallesAll(
    corteDetalles: CorteDetalle[]
  ): Observable<CorteDetalle[]> {
    return this.http
      .post(`${base_url}/cortedetalles-all`, corteDetalles)
      .pipe(map((resp: any) => resp.corteDetalles as CorteDetalle[]));
  }

  getCorteById(idcorte: number): Observable<Corte> {
    return this.http.get<Corte>(`${base_url}/cortes/${idcorte}`);
  }

  getDetalleByCorte(corte: Corte): Observable<CorteDetalle[]> {
    return this.http
      .post(`${base_url}/cortedetalles/bycorte`, corte)
      .pipe(map((resp: any) => resp.detalles as CorteDetalle[]));
  }
}
