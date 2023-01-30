import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tupa } from '../models/tupa.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TupaService {

  constructor( private http: HttpClient ) { }

  getAllTupas(): Observable<Tupa[]> {
    return this.http.get(`${base_url}/tupas`).pipe(
      map( (resp:any)=>resp.tupas as Tupa[] )
    );
  }

  getTupaById(id: number): Observable<Tupa> {
    return this.http.get<Tupa>(`${base_url}/tupas/${id}`);
  }
}
