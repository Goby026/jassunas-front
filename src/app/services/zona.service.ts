import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Zona } from '../models/zona.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ZonaService {
  constructor(private http: HttpClient) {}

  listAllZonas(): Observable<Zona[]> {
    return this.http.get(`${base_url}/zonas`).pipe(
      map((resp: any) => {
        return resp.zonas as Zona[];
      })
    );
  }
}
