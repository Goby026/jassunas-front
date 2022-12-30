import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CostoOtroServicio } from '../models/costootroservicio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CostoOtrosService {

  // tabla: tbcostootroservicio entidad: Costootroservicio
  constructor( private http: HttpClient ) { }

  getCosto_otros(idCosto: number){
    return this.http.get(`${base_url}/costo-otros/buscar/${idCosto}`)
    .pipe(
      map( (response: any)=> {
        return response.costootros as CostoOtroServicio[];
      } )
    );
  }

}