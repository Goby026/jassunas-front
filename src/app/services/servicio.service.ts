import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  constructor(private http: HttpClient) {}

  listServicios(): Observable<Servicio[]> {
    return this.http
      .get(`${base_url}/servicios`)
      .pipe(map((res: any) => res.servicios as Servicio[]));
  }
}
