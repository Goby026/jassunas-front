import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Caja } from '../models/caja.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(
    private http: HttpClient
    ) { }

  getCajaStatus():Observable<Caja>{
    return this.http.get<Caja>(`${base_url}/cajas/estatus`).pipe(
      catchError(e=>{
        return throwError(e);
      })
    );
  }

  getCajaById(idcaja: number):Observable<Caja>{
    return this.http.get<Caja>(`${base_url}/cajas/${idcaja}`);
  }

  getAllCajas(): Observable<Caja[]>{
    return this.http.get(`${base_url}/cajas`)
    .pipe(
      map( (response:any) => {
        return response.cajas as Caja[];
      })
    );
  }

  findCajaByDate(fecha: string): Observable<Caja[]> {
    return this.http.get(`${base_url}/cajas/buscar/${fecha}`)
    .pipe(
      map( (resp:any) => resp.cajas as Caja[]),
      catchError( e => {
        console.log(e.error)
        return throwError(e);
      })
    );
  }

  saveCaja( caja: Caja ): Observable<Caja>{
    return this.http.post<Caja>(`${base_url}/cajas`, caja).pipe(
      catchError( e => {
        console.log(e.error)
        return throwError(e);
      })
    );
  }

  closeCaja(caja: Caja){
    return this.http.put(`${base_url}/cajas/${caja.idcaja}`, caja).pipe(
      map( (resp:any) => resp.caja as Caja),
      catchError( e => {
        console.log(e.error)
        return throwError(e);
      })
    );
  }
}
