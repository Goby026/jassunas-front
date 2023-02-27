import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tarifario } from '../models/tarifario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TarifasService {

  constructor( private http:HttpClient ) { }

  findAllTarifas(): Observable<Tarifario[]>{
    return this.http.get(`${base_url}/tarifarios`)
    .pipe(
      map( ( resp: any )=> resp.tarifas as Tarifario[] )
    );
  }

  findTarifasByIdService(id: number){
    return this.http.get(`${base_url}/tarifarios/${id}`);
  }

  saveTarifa(tarifario: Tarifario):Observable<Tarifario>{
    return this.http.post<Tarifario>(`${base_url}/tarifarios`, tarifario);
  }

  updateTarifa(tarifario: Tarifario): Observable<Tarifario>{
    return this.http.put<Tarifario>(`${base_url}/tarifarios/${Number(tarifario.idtarifario)}`, tarifario);
  }

  disableTarifa(tarifario: Tarifario): Observable<Tarifario>{
    return this.http.post<Tarifario>(`${base_url}/tarifarios/desactivar`,tarifario);
  }

  // getTarifaByClient(){
  //   buscar costo por cliente
  // }

}
