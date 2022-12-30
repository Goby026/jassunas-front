import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TarifasService {

  constructor( private http:HttpClient ) { }

  findAllTarifas(){
    return this.http.get(`${base_url}/tarifarios`);
  }

  findTarifasByIdService(id: number){
    return this.http.get(`${base_url}/tarifarios/${id}`);
  }

  // getTarifaByClient(){
  //   buscar costo por cliente
  // }

}
