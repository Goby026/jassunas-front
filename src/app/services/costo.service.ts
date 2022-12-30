import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Costo } from '../models/costo.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CostoService {

  private encabezados: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // 'Authorization': `${token}`
  });

  constructor( private http: HttpClient ) { }

  // la entidad costos hace referencia a la configuracion de costos del cliente
  getCostsByClient(idCliente: number):Observable<Costo[]>{
    return this.http.get(`${base_url}/costos/buscar/${idCliente}` , { headers: this.encabezados }).pipe(
      map( (resp:any)=>{
        return resp.costos as Costo[]
      } )
    );
  }

  saveCost(costo: Costo){
    return this.http.post( `${base_url}/costos`, costo, { headers: this.encabezados } );
  }

  getCostoById( idCosto: number ): Observable<Costo>{
    return this.http.get<Costo>(`${base_url}/costos/${idCosto}` , { headers: this.encabezados });
  }
}
