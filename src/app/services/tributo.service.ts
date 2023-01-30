import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tributo } from '../models/tributo.model';
import { TributoDetalle } from '../models/tributoDetalle.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TributoService {

  constructor( private http: HttpClient ) { }

  getAllTributes(){
    return this.http.get(`${base_url}/tributos`);
  }

  saveTributo(tributo: any): Observable<Tributo> {
    return this.http.post<Tributo>(`${base_url}/tributos`, tributo);
  }

  saveDetalleTributo(detalles: TributoDetalle[]){
    return this.http.post(`${base_url}/tributo-detalles/service`, detalles);
  }
}
