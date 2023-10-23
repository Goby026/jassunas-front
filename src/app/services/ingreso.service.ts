import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingreso } from '../models/ingreso.model';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  constructor(
    private http: HttpClient
  ) { }


  getIngresos(): Observable<Ingreso[]>{
    return this.http.get(`${base_url}/ingresos`).pipe(
      map( (resp:any)=> resp.ingresos as Ingreso[] ),
      catchError( e => {
        console.log(e.error)
        return throwError(e);
      })
    );
  }


  saveIngreso(ingreso: Ingreso): Observable<Ingreso>{
    return this.http.post<Ingreso>(`${base_url}/ingresos`, ingreso).pipe(
      catchError( e => {
        console.log(e.error)
        return throwError(e);
      })
    );
  }
}
