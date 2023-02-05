import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Deuda } from '../models/deuda.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  constructor( private http: HttpClient ) { }

  // obtener deudas con estado pendiente
  getUserDebt(idCliente: number){
    return this.http.get(`${base_url}/deudas/buscar/${idCliente}`)
    .pipe(
      map( (resp: any) =>{
        if(resp){
          return resp.deudas.filter( (item:any)=>{
            return item.deudaEstado.iddeudaEstado === 3;
          });
        }else{
          return []
        }
      })
     );
    // return this.http.get(`${base_url}/deudas/buscar/${idCliente}`);
  }

  // obtener todas las deudas
  getAllUserDebt(idCliente: number){
    return this.http.get(`${base_url}/deudas/buscar/${idCliente}`)
    .pipe(
      map( (resp: any) => resp.deudas as Deuda[])
     );
    // return this.http.get(`${base_url}/deudas/buscar/${idCliente}`);
  }

  // listar deudas por zona y por año
  geDebtsByZoneAndYear(idzona: number, year: number): Observable<Deuda[]> {
    return this.http.get(`${base_url}/deudas/buscar-zona/${idzona}/${year}`)
    .pipe(
      map( (resp: any) =>{
        return resp.deudas as Deuda[];
      })
     );
  }

  //()=> actualizar estado de deudas
  updateUserDebts(deuda: Deuda[]): Observable<Deuda[]> {
    return this.http.put(`${base_url}/deudas/service`, deuda)
    .pipe(
      map( (res: any)=> res.deudas as Deuda[])
    );
  }
}
