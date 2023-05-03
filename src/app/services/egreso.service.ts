import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Egreso } from '../models/egreso.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EgresoService {

  constructor( private http: HttpClient ) { }

  // OBTENER TODOS LOS REGISTROS
  getAll(): Observable<Egreso[]>{
    return this.http.get(`${base_url}/egresos`).pipe(
      map( (res: any) => res.egresos as Egreso[] )
    );
  }

  // OBTENER POR ID
  getById( id: number ): Observable<Egreso>{
    return this.http.get<Egreso>(`${base_url}/egresos/${id}`);
  }

  // REGISTRAR
  save( tipo: Egreso ): Observable<Egreso>{
    return this.http.post<Egreso>(`${base_url}/egresos`, tipo);
  }

  // ACTUALIZAR
  update( egreso: Egreso ): Observable<Egreso>{
    return this.http.put<Egreso>(`${base_url}/egresos/${egreso.idegreso}`, egreso);
  }

  //OBTENER EGRESOS POR ID DE CAJA
  getAllByCaja(idcaja: number): Observable<Egreso[]>{
    return this.http.get(`${base_url}/egresos/caja/${idcaja}`).pipe(
      map( (res: any) => res.egresos as Egreso[] )
    );
  }
}
