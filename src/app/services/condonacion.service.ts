import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Condonacion } from '../models/condonacion.model';
import { Router } from '@angular/router';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CondonacionService {

  private encabezados: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // 'Authorization': `${token}`
  });

  constructor( private http: HttpClient, private router: Router ) { }

  saveCondonaciones(conds: Condonacion[]): Observable<Condonacion>{
    return this.http.post<Condonacion>(`${base_url}/condonaciones/service`, conds, {
      headers: this.encabezados
    }).pipe(
      catchError( e => {
        // this.router.navigate();
        alert(`Error al guardar ${e} error`);
        return throwError(e);
      })
    );
  }
}
