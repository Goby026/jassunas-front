import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tributo } from '../models/tributo.model';
import { TributoDetalle } from '../models/tributoDetalle.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TributoService {

  constructor( private http: HttpClient ) { }

  getAllTributes(): Observable<Tributo[]>{
    return this.http.get(`${base_url}/tributos`).pipe(
      map( (res: any)=> {
        return res.tributos as Tributo[]
      })
    );
  }

  saveTributo(tributo: any): Observable<Tributo> {
    return this.http.post<Tributo>(`${base_url}/tributos`, tributo);
  }

  saveDetalleTributo(detalles: TributoDetalle[]){
    return this.http.post(`${base_url}/tributo-detalles/service`, detalles);
  }

  getDetallesTributoDates(codrequi: number, desde: string, hasta: string): Observable<TributoDetalle[]>{
    return this.http.get(`${base_url}/tributo-detalles/reporte/${codrequi}/${desde}/${hasta}`).pipe(
      map( (res: any)=> {
        return res.detalles as TributoDetalle[];
      })
    );
  }
}
