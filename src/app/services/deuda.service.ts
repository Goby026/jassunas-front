import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  deudas: any[] = [];

  constructor( private http: HttpClient ) { }

  getUserDebt(cliente: any){
    return this.http.post(`${base_url}/deudas/buscar`, cliente)
    .pipe(
      map( (resp: any) =>{
        if(resp){
          return this.deudas = resp.deudas.filter( (item:any)=>{
            return item.deudaEstado.iddeudaEstado === 3;
          });
        }else{
          return []
        }
      })
     );
  }

  // listar deudas pre-pagadas por cliente
  getUserPreDebt(cliente: any){
    return this.http.post(`${base_url}/deudas/buscar`, cliente)
    .pipe(
      map( (resp: any) =>{
        if(resp){
          return resp.deudas.filter( (item:any)=>{
            return item.deudaEstado.iddeudaEstado === 1;
          });
        }else{
          return [];
        }
      })
     );
  }

  updateUserDebt(deudaEstado:any, idDeuda: number){
    return this.http.put(`${base_url}/deudas/${idDeuda}`, deudaEstado);
  }
}
