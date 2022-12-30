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

  constructor( private http: HttpClient ) { }

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

  //()=> listar deudas pre-pagadas por cliente
  // getUserPreDebt(cliente: any){
  //   return this.http.post(`${base_url}/deudas/buscar`, cliente)
  //   .pipe(
  //     map( (resp: any) =>{
  //       if(resp){
  //         return resp.deudas.filter( (item:any)=>{
  //           return item.deudaEstado.iddeudaEstado === 1;
  //         });
  //       }else{
  //         return [];
  //       }
  //     })
  //    );
  // }

  //()=> actualizar estado de deudas
  updateUserDebts(deuda: any[]){
    return this.http.put(`${base_url}/deudas/service`, deuda);
  }
}
