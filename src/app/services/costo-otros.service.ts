import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CostoOtrosService {

  // tabla: tbcostootroservicio entidad: Costootroservicio
  constructor( private http: HttpClient ) { }

  getCosto_otros(idCosto: number){
    return this.http.get(`${base_url}/costo-otros/buscar/${idCosto}`);
  }

}
