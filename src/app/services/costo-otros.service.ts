import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CostoOtroServicio } from '../models/costootroservicio.model';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class CostoOtrosService {
  // tabla: tbcostootroservicio entidad: Costootroservicio
  constructor(private http: HttpClient) {}

  getCosto_otros(idCosto: number): Observable<CostoOtroServicio[]> {
    {
      return this.http.get(`${base_url}/costo-otros/buscar/${idCosto}`).pipe(
        map((response: any) => {
          return response.costootros as CostoOtroServicio[];
        })
      );
    }
  }

  updateCostoOtroServicio(
    costoOtro: CostoOtroServicio
  ): Observable<CostoOtroServicio> {
    return this.http.put<CostoOtroServicio>(
      `${base_url}/costo-otros/${costoOtro.id}`,
      costoOtro
    );
  }

  saveCostoOtroServicio(costoOtro: CostoOtroServicio): Observable<CostoOtroServicio> {
    return this.http.post(`${base_url}/costo-otros`,
      costoOtro
    ).pipe(
      map( (res:any)=> res.costootro as CostoOtroServicio )
    );
  }
}
