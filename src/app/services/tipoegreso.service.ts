import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TipoEgreso } from '../models/tipoegreso.model';
import { Observable, map } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TipoegresoService {

  constructor( private http: HttpClient ) { }

  // OBTENER TODOS LOS REGISTROS
  getAll(): Observable<TipoEgreso[]>{
    return this.http.get(`${base_url}/tipoegresos`).pipe(
      map( (res:any)=> {
        return res.tipoEgresos as TipoEgreso[];
      } )
    );
  }

  // OBTENER POR ID
  getById( id: number ): Observable<TipoEgreso>{
    return this.http.get<TipoEgreso>(`${base_url}/tipoegresos/${id}`);
  }

  // REGISTRAR
  save( tipo: TipoEgreso ): Observable<TipoEgreso>{
    return this.http.post<TipoEgreso>(`${base_url}/tipoegresos`, tipo);
  }

  // ACTUALIZAR
  update( tipo: TipoEgreso ): Observable<TipoEgreso>{
    return this.http.put<TipoEgreso>(`${base_url}/tipoegresos/${tipo.idtipoegreso}`, tipo);
  }
}
